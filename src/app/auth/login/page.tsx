'use client';

import { useState } from 'react';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 시도:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* 로고 */}
        <div className="mb-[14px] text-center">
          <Image
            src="/logo/logo_symbol.png"
            alt="로고"
            width={136}
            height={98}
            className="mx-auto"
          />
        </div>

        {/* 제목 섹션 */}
        <div className="mb-8 text-center">
          <h1 className="text-header1 font-bold text-[#181D27] mb-[10px]">
            만나서 반갑습니다!
          </h1>
          <p className="text-body2 font-medium text-gray-500">
            로그인을 위해 정보를 입력해주세요
          </p>
        </div>

        {/* 폼 섹션 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-6">
          <div>
            <Input
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <Input
              type={isPasswordVisible ? "text" : "password"}
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              showPasswordToggle={true}
              onTogglePassword={togglePasswordVisibility}
              isPasswordVisible={isPasswordVisible}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>

        {/* 로그인 버튼 */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-full mb-5"
          onClick={handleSubmit}
        >
          로그인
        </Button>

        {/* 회원가입 링크 */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-body3 font-medium text-gray-500">
            계정이 없으신가요?
          </span>
          <Link 
            href="/auth/signup" 
            className="text-body3 font-semibold text-gray-700 underline decoration-solid"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
