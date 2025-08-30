import { apiClient } from "./api";
import {
  MainTopicWithStats,
  CuratedSubTopicWithRelations,
  PaginatedResponse,
  GetMainTopicsParams,
  GetCuratedSubTopicsParams,
  GetCuratedSubTopicsByLevelParams,
  GetCuratedSubTopicsByMainTopicParams,
  MainTopicResponse,
} from "../types/api";

export const topicsService = {
  /**
   * 대주제 목록 조회 (페이징)
   */
  async getMainTopics(
    params?: GetMainTopicsParams
  ): Promise<PaginatedResponse<MainTopicResponse>> {
    const response = await apiClient.get<PaginatedResponse<MainTopicResponse>>(
      "/main-topics",
      {
        params: {
          page: 1,
          size: 20,
          is_active: true,
          ...params,
        },
      }
    );
    return response.data;
  },

  /**
   * 특정 대주제 상세 조회
   * @param topicId 대주제 ID
   */
  async getMainTopic(topicId: number): Promise<MainTopicWithStats> {
    const response = await apiClient.get<MainTopicWithStats>(
      `/main-topics/${topicId}`
    );
    return response.data;
  },

  /**
   * 큐레이션 소주제 목록 조회 (페이징)
   */
  async getCuratedSubTopics(
    params?: GetCuratedSubTopicsParams
  ): Promise<PaginatedResponse<CuratedSubTopicWithRelations>> {
    const response = await apiClient.get<
      PaginatedResponse<CuratedSubTopicWithRelations>
    >("/sub-topics/curated", {
      params: {
        page: 1,
        size: 20,
        is_active: true,
        order_by: "title",
        ...params,
      },
    });
    return response.data;
  },

  /**
   * 특정 난이도의 큐레이션 소주제 조회
   * @param levelCode 난이도 코드
   * @param params 추가 파라미터
   */
  async getCuratedSubTopicsByLevel(
    levelCode: string,
    params?: GetCuratedSubTopicsByLevelParams
  ): Promise<CuratedSubTopicWithRelations[]> {
    const response = await apiClient.get<CuratedSubTopicWithRelations[]>(
      `/sub-topics/curated/by-level/${levelCode}`,
      {
        params: {
          is_active: true,
          limit: 50,
          ...params,
        },
      }
    );
    return response.data;
  },

  /**
   * 특정 대주제의 큐레이션 소주제 조회
   * @param topicId 대주제 ID
   * @param params 추가 파라미터
   */
  async getCuratedSubTopicsByMainTopic(
    topicId: number,
    params?: GetCuratedSubTopicsByMainTopicParams
  ): Promise<CuratedSubTopicWithRelations[]> {
    const response = await apiClient.get<CuratedSubTopicWithRelations[]>(
      `/sub-topics/curated/by-main-topic/${topicId}`,
      {
        params: {
          is_active: true,
          order_by: "difficulty_score",
          ...params,
        },
      }
    );
    return response.data;
  },

  /**
   * 특정 큐레이션 소주제 상세 조회
   * @param subTopicId 소주제 ID
   */
  async getCuratedSubTopic(
    subTopicId: number
  ): Promise<CuratedSubTopicWithRelations> {
    const response = await apiClient.get<CuratedSubTopicWithRelations>(
      `/sub-topics/curated/${subTopicId}`
    );
    return response.data;
  },

  /**
   * 인기 큐레이션 소주제 조회
   * @param levelCode 난이도 코드
   * @param limit 조회할 개수 (기본값: 10)
   */
  async getPopularCuratedSubTopics(
    levelCode: string,
    limit: number = 10
  ): Promise<CuratedSubTopicWithRelations[]> {
    const response = await apiClient.get<CuratedSubTopicWithRelations[]>(
      `/sub-topics/curated/popular/${levelCode}`,
      {
        params: { limit },
      }
    );
    return response.data;
  },
};
