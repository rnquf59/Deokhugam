"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import Image from "next/image";

interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      placeholder = "내가 찾는 책 이름을 검색해보세요",
      onSearch,
      onClear,
      onChange,
      className = "",
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    // 상태 결정
    const getSearchState = () => {
      if (isFocused) return "typing";
      if (typeof inputValue === "string" && inputValue.length > 0)
        return "completed";
      return "default";
    };

    const searchState = getSearchState();

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(newValue);
    };

    // 포커스 핸들러
    const handleFocus = () => {
      setIsFocused(true);
    };

    // 블러 핸들러
    const handleBlur = () => {
      setIsFocused(false);
    };

    // 검색 핸들러
    const handleSearch = () => {
      if (typeof inputValue === "string" && inputValue.trim()) {
        onSearch?.(inputValue.trim());
      }
    };

    // 지우기 핸들러
    const handleClear = () => {
      setInputValue("");
      onChange?.("");
      onClear?.();
    };

    // 엔터키 핸들러
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    // 상태별 컨테이너 스타일
    const getContainerStyles = () => {
      switch (searchState) {
        case "typing":
          return "bg-white border-[1.5px] border-gray-400 shadow-[0px_4px_8px_0px_rgba(24,24,24,0.05)]";
        case "completed":
          return "bg-gray-100 border-[1.5px] border-transparent";
        default:
          return "bg-gray-100 border-[1.5px] border-transparent";
      }
    };

    // 상태별 텍스트 스타일
    const getTextStyles = () => {
      switch (searchState) {
        case "typing":
          return "text-gray-800";
        case "completed":
          return "text-gray-600";
        default:
          return "text-gray-400";
      }
    };

    return (
      <div className={`relative ${className}`}>
        <div className="absolute left-[22px] top-1/2 transform -translate-y-1/2 z-10">
          <Image
            src="/images/icon/ic_search.svg"
            alt="검색"
            width={20}
            height={20}
          />
        </div>

        <input
          ref={ref}
          type="text"
          placeholder={searchState === "typing" ? "" : placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full py-[13px] pl-[50px] pr-[50px] rounded-full text-body2 font-medium placeholder:text-gray-400 !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none transition-all duration-200 ${getContainerStyles()} ${getTextStyles()}`}
          {...props}
        />

        {(searchState === "typing" ||
          (searchState === "completed" &&
            typeof inputValue === "string" &&
            inputValue.length > 0)) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-[22px] top-1/2 transform -translate-y-1/2 w-[20px] h-[20px] flex items-center justify-center hover:opacity-70 transition-opacity z-10"
          >
            <Image
              src="/images/icon/ic_xbox.svg"
              alt="지우기"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
