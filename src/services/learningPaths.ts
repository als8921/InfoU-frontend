import { apiClient } from "./api";
import {
  LearningPathListResponse,
  LearningPathDetailResponse,
  CurriculumItemResponse,
  GenerateLearningPathRequest,
  GenerateLearningPathResponse,
} from "@/types/api";

export const learningPathsService = {
  /**
   * 소주제의 학습 경로 목록 조회
   * GET /api/sub-topics/{sub_topic_id}/learning-paths
   */
  async getLearningPaths(subTopicId: number): Promise<LearningPathListResponse[]> {
    const response = await apiClient.get<LearningPathListResponse[]>(
      `/api/sub-topics/${subTopicId}/learning-paths`
    );
    return response.data;
  },

  /**
   * 특정 학습 경로 상세 조회
   * GET /api/learning-paths/{path_id}
   */
  async getLearningPathDetail(pathId: string): Promise<LearningPathDetailResponse> {
    const response = await apiClient.get<LearningPathDetailResponse>(
      `/api/learning-paths/${pathId}`
    );
    return response.data;
  },

  /**
   * AI 커리큘럼 생성
   * POST /api/sub-topics/{sub_topic_id}/learning-paths/generate
   */
  async generateLearningPath(
    subTopicId: number,
    request: GenerateLearningPathRequest
  ): Promise<GenerateLearningPathResponse> {
    const response = await apiClient.post<GenerateLearningPathResponse>(
      `/api/sub-topics/${subTopicId}/learning-paths/generate`,
      request
    );
    return response.data;
  },

  /**
   * 커리큘럼 아이템 목록 조회
   * GET /api/learning-paths/{path_id}/curriculum-items
   */
  async getCurriculumItems(pathId: string): Promise<CurriculumItemResponse[]> {
    const response = await apiClient.get<CurriculumItemResponse[]>(
      `/api/learning-paths/${pathId}/curriculum-items`
    );
    return response.data;
  },
};