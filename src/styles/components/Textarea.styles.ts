import clsx from "clsx";

export interface TextareaStylesProps {
  isFocused: boolean;
  hasValue: boolean;
  className?: string;
}

export const getTextareaStyles = ({
  isFocused,
  hasValue,
  className
}: TextareaStylesProps) => {
  return clsx(
    "w-full py-[20px] px-[20px] rounded-[14px] text-body2 font-medium resize-none !outline-none transition-all duration-200 box-border border-[1.5px]",
    isFocused
      ? "bg-white border-gray-400 text-gray-800"
      : "bg-gray-100 border-transparent",
    hasValue ? "text-gray-600" : "text-gray-400",
    className
  );
};
