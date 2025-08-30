import { apiClient } from "./api";
import { LevelResponse, LevelWithStats } from "../types/api";

export const levelsService = {
  /**
   * 모든 난이도 조회
   */
  async getLevels(): Promise<LevelResponse[]> {
    const response = await apiClient.get<LevelResponse[]>("/levels");
    return response.data;
  },

  /**
   * 통계가 포함된 난이도 조회
   * 각 난이도별 대주제, 소주제 개수 포함
   */
  async getLevelsWithStats(): Promise<LevelWithStats[]> {
    const response = await apiClient.get<LevelWithStats[]>(
      "/levels/with-stats"
    );
    return response.data;
  },

  /**
   * 특정 난이도 코드로 상세 정보 조회
   * @param levelCode 난이도 코드 (예: "beginner", "intermediate", "advanced")
   */
  async getLevelByCode(levelCode: string): Promise<LevelResponse> {
    const response = await apiClient.get<LevelResponse>(`/levels/${levelCode}`);
    return response.data;
  },
};
