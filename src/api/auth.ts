import { apiClient, API_ENDPOINTS } from './client';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse, User } from '@/types/auth';

// 인증 API 함수들
export const authApi = {
  // 회원가입
  async signup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<SignupResponse>(
        API_ENDPOINTS.USERS.SIGNUP,
        userData
      );
      return response;
    } catch (error) {
      console.error('회원가입 API 에러:', error);
      
      // 에러 메시지 처리
      if (error instanceof Error) {
        if (error.message.includes('409')) {
          throw new Error('이미 사용 중인 이메일입니다.');
        } else if (error.message.includes('400')) {
          throw new Error('입력값을 확인해주세요.');
        } else if (error.message.includes('500')) {
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
      
      throw new Error('회원가입에 실패했습니다.');
    }
  },

  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.USERS.LOGIN,
        credentials
      );
      return response;
    } catch (error) {
      console.error('로그인 API 에러:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          throw new Error('이메일 또는 비밀번호를 확인해주세요.');
        } else if (error.message.includes('500')) {
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
      
      throw new Error('로그인에 실패했습니다.');
    }
  },

  // 사용자 프로필 조회
  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE);
      return response;
    } catch (error) {
      console.error('사용자 프로필 조회 API 에러:', error);
      throw new Error('사용자 정보를 가져오는데 실패했습니다.');
    }
  },
};
