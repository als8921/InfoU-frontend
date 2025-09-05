// API 서비스들을 통합 export
export { apiClient, healthCheck } from "./api";
export { levelsService } from "./levels";
export { topicsService } from "./topics";
export { learningPathsService } from "./learningPaths";
export { articlesService } from "./articles";

// 모든 서비스를 하나의 객체로 export
import { levelsService } from "./levels";
import { topicsService } from "./topics";
import { learningPathsService } from "./learningPaths";
import { articlesService } from "./articles";

export const api = {
  levels: levelsService,
  topics: topicsService,
  learningPaths: learningPathsService,
  articles: articlesService,
} as const;