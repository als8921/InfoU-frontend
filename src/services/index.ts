// API 서비스들을 통합 export
export { apiClient, healthCheck } from "./api";
export { levelsService } from "./levels";
export { topicsService } from "./topics";

// 모든 서비스를 하나의 객체로 export
import { levelsService } from "./levels";
import { topicsService } from "./topics";

export const api = {
  levels: levelsService,
  topics: topicsService,
} as const;
