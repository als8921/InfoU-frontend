// OpenAPI 스키마에 기반한 타입 정의

// 기본 응답 타입들
export interface MainTopicResponse {
  main_topic_id: number;
  name: string;
  description: string;
}

export interface SubTopicResponse {
  sub_topic_id: number;
  name: string;
  description: string;
  source_type: string;
}

export interface LearningPathListResponse {
  path_id: string;
  title: string;
  description: string;
  curriculum_count: number;
  estimated_hours: number;
}

export interface LearningPathDetailResponse {
  path_id: string;
  title: string;
  description: string;
  curriculum_items: CurriculumItemResponse[];
}

export interface CurriculumItemResponse {
  curriculum_item_id: string;
  title: string;
  sort_order: number;
  has_articles?: boolean;
}

export interface LevelResponse {
  level_code: string;
  name: string;
  description: string;
}

export interface ArticleListResponse {
  article_id: string;
  level_code: string;
  title: string;
  preview: string;
}

export interface ArticleDetailResponse {
  article_id: string;
  title: string;
  body: string;
  level_code: string;
  curriculum_item_id: string;
  is_read?: boolean | null;
}

export interface ArticleNavigationResponse {
  article_id: string;
  title: string;
  curriculum_item_id: string;
  level_code: string;
}

export interface ReadResponse {
  article_id: string;
  read_at: string;
}

export interface ProgressResponse {
  total_articles: number;
  read_articles: number;
  progress_percentage: number;
  current_article?: CurrentArticleResponse | null;
}

export interface CurrentArticleResponse {
  article_id: string;
  title: string;
}

// 요청 타입들
export interface GenerateSubTopicRequest {
  topic_hint: string;
}

export interface GenerateSubTopicResponse {
  sub_topic_id: number;
  name: string;
  description: string;
  source_type: string;
}

export interface GenerateLearningPathRequest {
  learning_objective: string;
  difficulty: string;
  item_count: number;
}

export interface GenerateLearningPathResponse {
  path_id: string;
  title: string;
  curriculum_items: CurriculumItemResponse[];
}

export interface GenerateArticleRequest {
  level: string;
  content_style: string;
  word_count: number;
}

export interface GenerateArticleResponse {
  article_id: string;
  title: string;
  body: string;
  level_code: string;
  curriculum_item_id: string;
}

// 에러 타입들
export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}