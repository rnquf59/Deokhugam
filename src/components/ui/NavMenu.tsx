"use client";

import { useDisclosure } from "@/hooks/common/useDisclosure";
import clsx from "clsx";
import Modal from "./Modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi, patchUserProfile } from "@/api/auth";

export default function NavMenu({
  userId,
  userNickname,
  setUserNickname,
  profileMenuController,
}: {
  userId: string;
  userNickname: string;
  setUserNickname: Dispatch<SetStateAction<string>>;
  profileMenuController: Dispatch<SetStateAction<boolean>>;
}) {
  const [nicknameValue, setNicknameValue] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const { isOpen, open, close } = useDisclosure();
  const logout = useAuthStore((state) => state.logout);

  const submitDisabled =
    nicknameValue.length === 0 || nicknameValue === userNickname;

  const handleModalClose = () => {
    setNicknameValue(userNickname);
    close();
  };
  const handleOnSubmit = async () => {
    setSubmitLoading(true);
    try {
      await patchUserProfile(userId, nicknameValue);
      const updatedProfile = await authApi.getUserProfile(userId);

      setUserNickname(updatedProfile.nickname);

      close();
      profileMenuController(false);
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    setNicknameValue(userNickname);
  }, [userNickname]);

  return (
    <>
      <ul className="absolute top-10 right-0 rounded-[12px] border border-solid border-gray-200 bg-white min-w-max text-center overflow-hidden text-gray-600 font-medium">
        <li
          className={clsx(
            "px-8 py-4 cursor-pointer duration-[0.2s]",
            "hover:bg-gray-50"
          )}
          onClick={open}
        >
          닉네임 변경
        </li>
        <li
          className={clsx(
            "px-8 py-4 cursor-pointer duration-[0.2s]",
            "hover:bg-gray-50"
          )}
          onClick={logout}
        >
          로그아웃
        </li>
        <li
          className={clsx(
            "px-8 py-4 cursor-pointer duration-[0.2s]",
            "hover:bg-gray-50 text-red-500"
          )}
        >
          탈퇴하기
        </li>
      </ul>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        disabled={submitDisabled || submitLoading}
        action={handleOnSubmit}
      >
        <h2 className="text-lg font-semibold mb-5">닉네임 변경</h2>
        <input
          type="text"
          defaultValue={userNickname}
          placeholder="닉네임을 입력해주세요"
          maxLength={15}
          className={clsx(
            "w-full h-[46px] bg-gray-100 px-5 rounded-full",
            "placeholder:text-gray-400 placeholder:font-medium"
          )}
          onChange={(e) => setNicknameValue(e.target.value)}
        />
        {nicknameValue.length === 0 && (
          <p className="text-sm mt-1 text-red-500 px-5 font-medium">
            닉네임 입력은 필수입니다.
          </p>
        )}
      </Modal>
    </>
  );
}
