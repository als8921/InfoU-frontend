import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 성공 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // 에러 로깅
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    // 에러 메시지 처리
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    if (error.response) {
      // 서버 응답이 있는 경우
      switch (error.response.status) {
        case 400:
          errorMessage = "잘못된 요청입니다.";
          break;
        case 401:
          errorMessage = "인증이 필요합니다.";
          break;
        case 403:
          errorMessage = "접근 권한이 없습니다.";
          break;
        case 404:
          errorMessage = "요청한 데이터를 찾을 수 없습니다.";
          break;
        case 422:
          errorMessage = "입력 데이터를 확인해주세요.";
          break;
        case 500:
          errorMessage = "서버 오류가 발생했습니다.";
          break;
        default:
          errorMessage = `서버 오류: ${error.response.status}`;
      }
    } else if (error.request) {
      // 네트워크 오류
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    // 커스텀 에러 객체 생성
    const customError = new Error(errorMessage);
    (customError as any).originalError = error;

    return Promise.reject(customError);
  }
);

// 공통 API 응답 타입
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// 헬스체크 함수
export const healthCheck = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    throw error;
  }
};
