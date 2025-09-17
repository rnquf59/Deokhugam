'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function SignUpPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 시도:', { email, nickname, password, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-gray-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* 제목 섹션 */}
        <div className="mb-8 text-center">
          <h1 className="text-header1 font-bold text-[#181D27] mb-[10px]">
            만나서 반갑습니다!
          </h1>
          <p className="text-body2 font-medium text-gray-500">
            가입을 위해 정보를 입력해주세요
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
              type="text"
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
          
          <div>
            <Input
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="비밀번호 확인"
              placeholder="한 번 더 입력해주세요"
              showPasswordToggle={true}
              onTogglePassword={toggleConfirmPasswordVisibility}
              isPasswordVisible={isConfirmPasswordVisible}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </form>

        {/* 가입하기 버튼 */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-full mb-5"
          onClick={handleSubmit}
        >
          가입하기
        </Button>

        {/* 로그인 링크 */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-body3 font-medium text-gray-500">
            계정이 있으신가요?
          </span>
          <Link 
            href="/auth/login" 
            className="text-body3 font-semibold text-gray-700 underline decoration-solid"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
