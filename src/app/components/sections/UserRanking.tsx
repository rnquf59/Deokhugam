'use client';

import { useState, useEffect } from 'react';
import { getPowerUsers, type PowerUser, type PowerUsersParams } from '@/api/users';

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
  period?: PowerUsersParams['period'];
}

export default function UserRanking({ users, hasPartialData = false, isEmpty = false, period = 'MONTHLY' }: UserRankingProps) {
  const [powerUsers, setPowerUsers] = useState<PowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPartialData, setIsPartialData] = useState(false);


  const fetchPowerUsers = async () => {
    if (isEmpty) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('API 호출 시작:', { period, direction: 'ASC', limit: 10 });
      
      const response = await getPowerUsers({ 
        period, 
        direction: 'ASC',
        limit: 10 
      });
      
      console.log('API 응답:', response);
      
      if (!response.content || response.content.length === 0) {
        setPowerUsers([]);
        setIsPartialData(false);
      } else {
        setPowerUsers(response.content);
        setIsPartialData(response.content.length < 10);
      }
    } catch (err) {
      console.error('파워 유저 조회 실패:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      console.error('오류 상세:', errorMessage);
      setError(`파워 유저를 불러오는데 실패했습니다: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPowerUsers();
  }, [period, isEmpty]);

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
        name: '',
        score: 0
      }));
    } else if (hasPartialData || isPartialData) {
      const apiData = powerUsers.length > 0 ? convertPowerUsers(powerUsers) : [];
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
            name: '',
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
          name: '',
          score: 0
        }));
      }
    }
  };

  const userList = getDisplayData();

  const getRankStyle = (rank: number, isEmpty: boolean) => {
    if (isEmpty) {
      return {
        color: '#54545E',
        fontSize: '14px',
        fontWeight: '600',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }
    
    if (rank <= 3) {
      const bgColors = {
        1: '#FFB310',
        2: '#9D9D9D', 
        3: '#846548'
      };
      
      return {
        backgroundColor: bgColors[rank as keyof typeof bgColors],
        color: '#FFFFFF',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    } else {
      return {
        color: '#54545E',
        fontSize: '14px',
        fontWeight: '600',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }
  };

  return (
    <div className="sticky  top-[67px] p-[30px] bg-gray-0 border-[1.5px] border-gray-200 rounded-[16px] shadow-sm">
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
          {userList.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <span 
                  className="text-body3 font-semibold"
                  style={getRankStyle(user.rank, isEmpty)}
                >
                  {isEmpty ? '-' : user.rank}
                </span>
                <span className="text-body2 font-semibold text-gray-900">
                  {user.name || '--'}
                </span>
              </div>
              
              <span className={`${!user.name ? 'text-body4 font-medium text-gray-500' : 'text-body3 font-semibold text-gray-600'}`}>
                {user.name ? `${user.score}점` : '--'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
