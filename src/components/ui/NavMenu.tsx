import clsx from "clsx";

export default function NavMenu() {
  return (
    <ul className="absolute top-10 right-0 rounded-[12px] border border-solid border-gray-200 bg-white min-w-max text-center overflow-hidden text-gray-600 font-medium">
      <li
        className={clsx(
          "px-8 py-4 cursor-pointer duration-[0.2s]",
          "hover:bg-gray-50"
        )}
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
  );
}
