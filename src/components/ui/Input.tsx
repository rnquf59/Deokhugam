import { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  isPasswordVisible?: boolean;
}

export default function Input({ 
  label, 
  error, 
  showPasswordToggle = false, 
  onTogglePassword, 
  isPasswordVisible = false, 
  className = '', 
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  // 상태별 스타일 결정
  const getInputStyles = () => {
    // error prop이 있으면 error 상태
    if (error) {
      return 'bg-gray-100 border-[1.5px] border-red-500 text-gray-700';
    }
    
    // 포커스 중이면 typing 상태
    if (isFocused) {
      return 'bg-gray-0 border-[1.5px] border-gray-400 text-gray-800 shadow-[0px_4px_8px_0px_rgba(24,24,24,0.05)]';
    }
    
    // 값이 있으면 completed 상태
    if (hasValue) {
      return 'bg-gray-100 text-gray-600';
    }
    
    // default 상태
    return 'bg-gray-100 text-gray-800';
  };

  // 비밀번호 토글이 있을 때 오른쪽 패딩 조정
  const getPaddingStyles = () => {
    return showPasswordToggle ? 'px-[20px] pr-[56px]' : 'px-[20px]';
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-body3 font-semibold text-gray-500 mb-[10px]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full ${getPaddingStyles()} py-[13.5px] rounded-[100px] text-body2 font-medium placeholder:text-gray-400 !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none transition-all duration-200 ${getInputStyles()} ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-[20px] top-1/2 transform -translate-y-1/2"
          >
            {isPasswordVisible ? (
              <img src="/icon/ic_eye_open.png" alt="비밀번호 보기" className="w-6 h-6" />
            ) : (
              <img src="/icon/ic_eye-close.png" alt="비밀번호 가리기" className="w-6 h-6" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-body3 font-medium text-red-500 px-[8px] mt-[6px]">{error}</p>
      )}
    </div>
  );
}
