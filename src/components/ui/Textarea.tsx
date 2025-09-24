"use client";

import {
  useState,
  forwardRef,
  TextareaHTMLAttributes,
  memo,
  useCallback,
} from "react";

interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "value"
  > {
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

const Textarea = memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
      {
        placeholder = "내용을 입력해주세요",
        onChange,
        className = "",
        ...props
      },
      ref
    ) => {
      const [isFocused, setIsFocused] = useState(false);
      const [hasValue, setHasValue] = useState(false);

      // 상태 결정
      const getTextareaState = () => {
        if (isFocused) return "typing";
        if (hasValue) return "completed";
        return "normal";
      };

      const textareaState = getTextareaState();

      // 포커스 핸들러
      const handleFocus = () => {
        setIsFocused(true);
      };

      // 블러 핸들러
      const handleBlur = () => {
        setIsFocused(false);
      };

      // 값 변경 핸들러
      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          setHasValue(value.length > 0);
          onChange?.(value);
        },
        [onChange]
      );

      // 상태별 컨테이너 스타일
      const getContainerStyles = () => {
        switch (textareaState) {
          case "typing":
            return "bg-white border-[1.5px] border-gray-400";
          case "completed":
            return "bg-gray-100 border-[1.5px] border-transparent";
          default:
            return "bg-gray-100 border-[1.5px] border-transparent";
        }
      };

      // 상태별 텍스트 스타일
      const getTextStyles = () => {
        switch (textareaState) {
          case "typing":
            return "text-gray-800";
          case "completed":
            return "text-gray-600";
          default:
            return "text-gray-400";
        }
      };

      return (
        <textarea
          ref={ref}
          placeholder={textareaState === "typing" ? "" : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`w-full py-[20px] px-[20px] rounded-[14px] text-body2 font-medium resize-none !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none transition-all duration-200 box-border ${getContainerStyles()} ${getTextStyles()} ${className}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#D7D7DB transparent",
          }}
          {...props}
        />
      );
    }
  )
);

Textarea.displayName = "Textarea";

export default Textarea;
