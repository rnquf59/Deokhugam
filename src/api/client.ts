import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";

// API 기본 설정 - 프록시를 통해 호출
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/"
    : "http://localhost:3000/"; // 개발 환경에서는 프록시 사용

// API 클라이언트 클래스
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);

        // 인증된 사용자의 ID를 헤더에 추가
        if (typeof window !== "undefined") {
          const authState = useAuthStore.getState();
          if (authState.user?.id) {
            config.headers["Deokhugam-Request-User-ID"] = authState.user.id;
          }
        }

        return config;
      },
      (error) => {
        console.error("API 요청 에러:", error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API 응답: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error("API 응답 에러:", error);
        if (error.response) {
          // 서버에서 응답을 받았지만 에러 상태
          const errorMessage =
            error.response.data?.message ||
            `HTTP error! status: ${error.response.status}`;
          throw new Error(errorMessage);
        } else if (error.request) {
          // 요청을 보냈지만 응답을 받지 못함
          throw new Error("네트워크 에러: 서버에 연결할 수 없습니다.");
        } else {
          // 요청 설정 중 에러
          throw new Error("요청 설정 에러: " + error.message);
        }
      }
    );
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint);
    return response.data;
  }

  // POST 요청
  async post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    return response.data;
  }

  // PATCH 요청
  async patch<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data);
    return response.data;
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 사용자 관련
  USERS: {
    SIGNUP: "/api/users",
    LOGIN: "/api/users/login",
    PROFILE: (userId: string) => `/api/users/${userId}`,
  },
  // 도서 관련
  BOOKS: {
    LIST: "/api/books",
    DETAIL: "/api/books/{id}",
    CREATE: "/api/books",
    DELETE: "/api/books/{id}",
  },
  // 리뷰 관련
  REVIEWS: {
    LIST: "/api/reviews",
    DETAIL: "/api/reviews/{id}",
    CREATE: "/api/reviews",
    DELETE: "/api/reviews/{id}",
  },
} as const;
