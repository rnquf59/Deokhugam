"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavMenu from "./NavMenu";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const { open, setOpen, dropdownRef } = useClickOutside();

  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        const profile = await authApi.getUserProfile(userId);
        setUserNickname(profile.nickname);
      };

      fetchProfile();
    }
  }, [userId]);

  return (
    <div
      className={clsx(
        "fixed left-0 right-0 top-0 border-b border-solid border-gray-100 bg-white py-4",
        "max-[1172px]:px-4"
      )}
    >
      <div className="flex items-center justify-between max-w-[1140px] mx-auto">
        <div className="flex items-center gap-10">
          <Image
            src="/images/nav/deokhugam.svg"
            alt="Deokhugam"
            width={115}
            height={33}
            className="cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          />
          <ul className="flex items-center gap-3">
            <li className="px-3 cursor-pointer text-gray-500 font-medium">
              도서
            </li>
            <li className="px-3 cursor-pointer text-gray-500 font-medium">
              리뷰
            </li>
          </ul>
        </div>
        {!mounted ? null : userId ? (
          <div className="flex items-center gap-6">
            <div className="relative">
              <button className="h-4">
                <Image
                  src="/images/nav/notification.svg"
                  alt="알림"
                  width={20}
                  height={20}
                />
                {/* 알림 배지 */}
                <div className="absolute top-0 right-[-5px] w-1.5 h-1.5 bg-red-500 rounded" />
              </button>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1 text-gray-600 font-medium"
                onClick={() => setOpen((prev) => !prev)}
              >
                {userNickname}
                <Image
                  src="/images/nav/arrow_down.svg"
                  alt="arrow"
                  width={18}
                  height={18}
                  className={clsx("duration-100", open && "rotate-180")}
                />
              </button>
              <div
                className={clsx(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  open ? "max-h-[170px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <NavMenu
                  userId={userId}
                  userNickname={userNickname}
                  setUserNickname={setUserNickname}
                  profileMenuController={setOpen}
                />
              </div>
            </div>
          </div>
        ) : (
          <button
            className="border bg-gray-900 text-white rounded-md px-3 py-1.5 text-sm"
            onClick={() => router.push("/auth/login")}
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
}
