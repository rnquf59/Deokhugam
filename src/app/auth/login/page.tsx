'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  const emailValue = watch('email') || '';
  const passwordValue = watch('password') || '';

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = (data: LoginFormData) => {
    console.log('로그인 시도:', data);
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mb-6">
          <div>
            <Input
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              {...register('email')}
              error={errors.email?.message}
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
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
        </form>

        {/* 로그인 버튼 */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-full mb-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
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
