"use client";

import { useDisclosure } from "@/hooks/common/useDisclosure";
import clsx from "clsx";
import Modal from "./Modal";
import { useState } from "react";

export default function NavMenu() {
  const { isOpen, open, close } = useDisclosure();

  const [nickname, setNickname] = useState("");

  const handleDisabled = nickname.length === 0;

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
      <Modal isOpen={isOpen} onClose={close} disabled={handleDisabled}>
        <h2 className="text-lg font-semibold mb-5">닉네임 변경</h2>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          className={clsx(
            "w-full h-[46px] bg-gray-100 px-5 rounded-full",
            "placeholder:text-gray-400 placeholder:font-medium"
          )}
          onChange={(e) => setNickname(e.target.value)}
        />
        {nickname.length === 0 && (
          <p className="text-sm mt-1 text-red-500 px-5 font-medium">
            닉네임 입력은 필수입니다.
          </p>
        )}
      </Modal>
    </>
  );
}
