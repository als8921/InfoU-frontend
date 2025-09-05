import { apiClient } from "./api";
import {
  MainTopicResponse,
  SubTopicResponse,
  GenerateSubTopicRequest,
  GenerateSubTopicResponse,
} from "@/types/api";

export const topicsService = {
  /**
   * 대주제 목록 조회
   * GET /api/main-topics
   */
  async getMainTopics(): Promise<MainTopicResponse[]> {
    const response = await apiClient.get<MainTopicResponse[]>("/api/main-topics");
    return response.data;
  },

  /**
   * 특정 대주제의 소주제 목록 조회
   * GET /api/main-topics/{main_topic_id}/sub-topics
   */
  async getSubTopics(mainTopicId: number): Promise<SubTopicResponse[]> {
    const response = await apiClient.get<SubTopicResponse[]>(
      `/api/main-topics/${mainTopicId}/sub-topics`
    );
    return response.data;
  },

  /**
   * AI 소주제 생성
   * POST /api/main-topics/{main_topic_id}/sub-topics/generate
   */
  async generateSubTopic(
    mainTopicId: number,
    request: GenerateSubTopicRequest
  ): Promise<GenerateSubTopicResponse> {
    const response = await apiClient.post<GenerateSubTopicResponse>(
      `/api/main-topics/${mainTopicId}/sub-topics/generate`,
      request
    );
    return response.data;
  },
};