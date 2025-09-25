"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPowerUsers,
  type PowerUser,
  type PowerUsersParams
} from "@/api/users";

interface UserRankingItem {
  id: string;
  rank: number;
  name: string;
  score: number;
}

interface UserRankingProps {
  users?: UserRankingItem[];
  hasPartialData?: boolean;
  isEmpty?: boolean;
  period?: PowerUsersParams["period"];
}

export default function UserRanking({
  users,
  hasPartialData = false,
  isEmpty = false,
  period = "ALL_TIME"
}: UserRankingProps) {
  const [powerUsers, setPowerUsers] = useState<PowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPartialData, setIsPartialData] = useState(false);

  const fetchPowerUsers = useCallback(async () => {
    if (isEmpty) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("API 호출 시작:", { period, direction: "ASC", limit: 10 });

      const response = await getPowerUsers({
        period,
        direction: "ASC",
        limit: 10
      });

      console.log("API 응답:", response);

      if (!response.content || response.content.length === 0) {
        setPowerUsers([]);
        setIsPartialData(false);
      } else {
        setPowerUsers(response.content);
        setIsPartialData(response.content.length < 10);
      }
    } catch (err) {
      console.error("파워 유저 조회 실패:", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      console.error("오류 상세:", errorMessage);
      setError(`파워 유저를 불러오는데 실패했습니다: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [period, isEmpty]);

  useEffect(() => {
    fetchPowerUsers();
  }, [period, isEmpty, fetchPowerUsers]);

  const convertPowerUsers = (powerUsers: PowerUser[]): UserRankingItem[] => {
    return powerUsers.map(user => ({
      id: user.userId,
      rank: user.rank,
      name: user.nickname,
      score: Math.round(user.score)
    }));
  };

  const getDisplayData = () => {
    if (isEmpty) {
      return Array.from({ length: 10 }, (_, index) => ({
        id: `empty-${index + 1}`,
        rank: index + 1,
        name: "",
        score: 0
      }));
    } else if (hasPartialData || isPartialData) {
      const apiData =
        powerUsers.length > 0 ? convertPowerUsers(powerUsers) : [];
      const fullData = users || apiData;
      const result = [];

      for (let i = 1; i <= 10; i++) {
        const existingUser = fullData.find(user => user.rank === i);
        if (existingUser) {
          result.push(existingUser);
        } else {
          result.push({
            id: `empty-${i}`,
            rank: i,
            name: "",
            score: 0
          });
        }
      }

      return result;
    } else {
      if (powerUsers.length > 0) {
        return convertPowerUsers(powerUsers);
      } else if (users && users.length > 0) {
        return users;
      } else {
        return Array.from({ length: 10 }, (_, index) => ({
          id: `empty-${index + 1}`,
          rank: index + 1,
          name: "",
          score: 0
        }));
      }
    }
  };

  const userList = getDisplayData();

  const getRankClasses = (rank: number, isEmpty: boolean) => {
    const baseClasses =
      "w-[22px] h-[22px] flex items-center justify-center text-body3 font-semibold";

    if (isEmpty) {
      return `${baseClasses} text-gray-500`;
    }

    if (rank <= 3) {
      const bgClasses = {
        1: "bg-[#FFB310]",
        2: "bg-[#9D9D9D]",
        3: "bg-[#846548]"
      };

      return `${baseClasses} ${
        bgClasses[rank as keyof typeof bgClasses]
      } text-white rounded-full`;
    } else {
      return `${baseClasses} text-gray-600`;
    }
  };

  return (
    <div className="sticky  top-[127px] p-[30px] bg-gray-0 border-[1.5px] border-gray-200 rounded-[16px] shadow-sm">
      <div className="mb-[16px]">
        <h3 className="text-body2 font-bold text-gray-800">
          유저들의 활동 순위
        </h3>
      </div>

      {loading && !isEmpty ? (
        <div className="flex justify-center py-8">
          <p className="text-body2 text-gray-500">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8">
          <p className="text-body2 text-red-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {userList.map(user => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <span className={getRankClasses(user.rank, !user.name)}>
                  {!user.name ? "-" : user.rank}
                </span>
                <span
                  className={
                    user.name
                      ? "text-body2 font-semibold text-gray-900"
                      : "text-body2 font-medium text-gray-800"
                  }
                >
                  {user.name || "--"}
                </span>
              </div>

              <span
                className={
                  user.name
                    ? "text-body3 font-semibold text-gray-600"
                    : "text-body4 font-medium text-gray-500"
                }
              >
                {user.name ? `${user.score}점` : "--"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
