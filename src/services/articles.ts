import { apiClient } from "./api";
import {
  ArticleListResponse,
  ArticleDetailResponse,
  ArticleNavigationResponse,
  GenerateArticleRequest,
  GenerateArticleResponse,
  ReadResponse,
  ProgressResponse,
} from "@/types/api";

export const articlesService = {
  /**
   * 난이도별 글 목록 조회
   * GET /api/curriculum-items/{curriculum_item_id}/articles
   */
  async getArticlesByCurriculumItem(
    curriculumItemId: string,
    level?: string
  ): Promise<ArticleListResponse[]> {
    const params = level ? { level } : {};
    const response = await apiClient.get<ArticleListResponse[]>(
      `/api/curriculum-items/${curriculumItemId}/articles`,
      { params }
    );
    return response.data;
  },

  /**
   * 글 상세 조회
   * GET /api/articles/{article_id}
   */
  async getArticle(
    articleId: string,
    authorization?: string
  ): Promise<ArticleDetailResponse> {
    const headers = authorization ? { Authorization: authorization } : {};
    const response = await apiClient.get<ArticleDetailResponse>(
      `/api/articles/${articleId}`,
      { headers }
    );
    return response.data;
  },

  /**
   * 다음 글 조회
   * GET /api/articles/{article_id}/next
   */
  async getNextArticle(
    articleId: string,
    level?: string
  ): Promise<ArticleNavigationResponse | null> {
    const params = level ? { level } : {};
    const response = await apiClient.get<ArticleNavigationResponse | null>(
      `/api/articles/${articleId}/next`,
      { params }
    );
    return response.data;
  },

  /**
   * 이전 글 조회
   * GET /api/articles/{article_id}/previous
   */
  async getPreviousArticle(
    articleId: string,
    level?: string
  ): Promise<ArticleNavigationResponse | null> {
    const params = level ? { level } : {};
    const response = await apiClient.get<ArticleNavigationResponse | null>(
      `/api/articles/${articleId}/previous`,
      { params }
    );
    return response.data;
  },

  /**
   * AI 글 생성
   * POST /api/curriculum-items/{curriculum_item_id}/articles/generate
   */
  async generateArticle(
    curriculumItemId: string,
    request: GenerateArticleRequest
  ): Promise<GenerateArticleResponse> {
    const response = await apiClient.post<GenerateArticleResponse>(
      `/api/curriculum-items/${curriculumItemId}/articles/generate`,
      request
    );
    return response.data;
  },

  /**
   * 글 읽음 처리
   * POST /api/articles/{article_id}/read
   */
  async markArticleRead(
    articleId: string,
    authorization: string
  ): Promise<ReadResponse> {
    const response = await apiClient.post<ReadResponse>(
      `/api/articles/${articleId}/read`,
      {},
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  },

  /**
   * 사용자 진행률 조회
   * GET /api/users/{user_id}/progress
   */
  async getUserProgress(
    userId: string,
    authorization: string,
    subTopicId?: number
  ): Promise<ProgressResponse> {
    const params = subTopicId ? { sub_topic_id: subTopicId } : {};
    const response = await apiClient.get<ProgressResponse>(
      `/api/users/${userId}/progress`,
      {
        params,
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  },
};