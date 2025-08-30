// OpenAPI 스펙 기반 타입 정의

// 공통 응답 타입
export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 난이도 관련 타입
export interface LevelResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  target_audience: string;
  characteristics: string[];
  estimated_hours_per_week: number;
  order: number;
}

export interface LevelWithStats extends LevelResponse {
  main_topics_count: number;
  curated_sub_topics_count: number;
}

// 대주제 관련 타입
export interface MainTopicResponse {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MainTopicWithStats extends MainTopicResponse {
  curated_sub_topics_count: number;
}

// 소주제 관련 타입
export interface CuratedSubTopicWithRelations {
  id: number;
  title: string;
  description?: string;
  main_topic_id: number;
  level_id: number;
  keywords?: string[];
  learning_objectives?: string[];
  prerequisites?: string[];
  estimated_duration_minutes?: number;
  difficulty_score?: number;
  popularity_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  level: LevelResponse;
  main_topic: MainTopicResponse;
}

// API 에러 타입
export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// 요청 파라미터 타입들
export interface GetMainTopicsParams {
  page?: number;
  size?: number;
  is_active?: boolean;
  search?: string;
}

export interface GetCuratedSubTopicsParams {
  page?: number;
  size?: number;
  level_id?: number;
  main_topic_id?: number;
  is_active?: boolean;
  search?: string;
  order_by?: string;
}

export interface GetCuratedSubTopicsByLevelParams {
  is_active?: boolean;
  limit?: number;
}

export interface GetCuratedSubTopicsByMainTopicParams {
  is_active?: boolean;
  order_by?: string;
}
