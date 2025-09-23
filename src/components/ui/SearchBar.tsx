'use client';

import { useState, forwardRef, InputHTMLAttributes } from 'react';
import Image from 'next/image';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ 
  placeholder = "내가 찾는 책 이름을 검색해보세요",
  onSearch,
  onClear,
  onChange,
  className = '',
  value,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  // 상태 결정
  const getSearchState = () => {
    if (isFocused) return 'typing';
    if (typeof inputValue === 'string' && inputValue.length > 0) return 'completed';
    return 'default';
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
    if (typeof inputValue === 'string' && inputValue.trim()) {
      onSearch?.(inputValue.trim());
    }
  };

  // 지우기 핸들러
  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    onClear?.();
  };

  // 엔터키 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 상태별 스타일
  const getInputStyles = () => {
    switch (searchState) {
      case 'typing':
        return 'bg-gray-0 border-[1.5px] border-gray-400 text-gray-800 shadow-[0px_4px_8px_0px_rgba(24,24,24,0.05)]';
      case 'completed':
        return 'bg-gray-100 border border-gray-300 text-gray-600';
      default:
        return 'bg-gray-100 border border-gray-300 text-gray-800';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 검색 아이콘 */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Image 
          src="/images/icon/ic_search.svg" 
          alt="검색" 
          width={20} 
          height={20} 
          className="text-gray-400"
        />
      </div>

      {/* 입력 필드 */}
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        className={`w-full pl-10 pr-12 py-3 rounded-lg text-body2 font-medium placeholder:text-gray-400 !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none transition-all duration-200 ${getInputStyles()}`}
        {...props}
      />

      {/* 지우기 버튼 (타이핑 상태이거나 완료 상태일 때만 표시) */}
      {(searchState === 'typing' || (searchState === 'completed' && typeof inputValue === 'string' && inputValue.length > 0)) && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-200 rounded-full p-1 transition-colors"
        >
          <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none" 
              className="text-white"
            >
              <path 
                d="M9 3L3 9M3 3L9 9" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
