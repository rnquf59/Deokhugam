"use client";

import { useDisclosure } from "@/hooks/common/useDisclosure";
import clsx from "clsx";
import Modal from "./Modal";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useProfileActions } from "@/hooks/profile/useProfileActions";

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
  const { isOpen, open, close } = useDisclosure();
  const {
    logout,
    nicknameValue,
    setNicknameValue,
    actionType,
    setActionType,
    submitLoading,
    handleUpdateProfile,
    handleDeleteUser,
  } = useProfileActions(userId, setUserNickname, profileMenuController, close);

  const submitDisabled =
    nicknameValue.length <= 1 || nicknameValue === userNickname;

  const showDeleteModal = async () => {
    setActionType("deleteUser");
    open();
  };

  const handleModalClose = () => {
    setNicknameValue(userNickname);
    close();
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
          onClick={() => {
            open();
            setActionType("updateProfile");
          }}
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
          onClick={showDeleteModal}
        >
          탈퇴하기
        </li>
      </ul>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        disabled={
          (actionType === "updateProfile" && submitDisabled) || submitLoading
        }
        action={
          actionType === "updateProfile"
            ? handleUpdateProfile
            : handleDeleteUser
        }
      >
        {actionType === "updateProfile" ? (
          <>
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
            <p className="text-sm mt-1 text-red-500 px-5 font-medium">
              {nicknameValue.length === 0
                ? "닉네임 입력은 필수입니다."
                : nicknameValue.length <= 1
                ? "닉네임은 2글자 이상으로 입력해 주세요."
                : null}
            </p>
          </>
        ) : (
          <p>회원 탈퇴를 진행하시겠습니까?</p>
        )}
      </Modal>
    </>
  );
}
