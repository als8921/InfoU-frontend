import { apiClient } from "./api";
import { LevelResponse } from "@/types/api";

export const levelsService = {
  /**
   * 난이도 목록 조회
   * GET /api/levels
   */
  async getLevels(): Promise<LevelResponse[]> {
    const response = await apiClient.get<LevelResponse[]>("/api/levels");
    return response.data;
  },
};