import { Topic, Curriculum, Article } from './contracts';

// API 엔드포인트 정의
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  topics: `${API_BASE}/topics`,
  curriculum: (topicSlug: string, level: string) => 
    `${API_BASE}/curriculum/${topicSlug}?level=${level}`,
  article: (id: string) => `${API_BASE}/articles/${id}`,
} as const;

// 데이터 페칭 함수들
export async function fetchTopics(): Promise<Topic[]> {
  const response = await fetch(API_ENDPOINTS.topics);
  if (!response.ok) {
    throw new Error('주제 목록을 불러오는데 실패했습니다.');
  }
  return response.json();
}

export async function fetchCurriculum(topicSlug: string, level: string): Promise<Curriculum> {
  const response = await fetch(API_ENDPOINTS.curriculum(topicSlug, level));
  if (!response.ok) {
    throw new Error('커리큘럼을 불러오는데 실패했습니다.');
  }
  return response.json();
}

export async function fetchArticle(id: string): Promise<Article> {
  const response = await fetch(API_ENDPOINTS.article(id));
  if (!response.ok) {
    throw new Error('글을 불러오는데 실패했습니다.');
  }
  return response.json();
}

// 검색 함수
export async function searchTopics(query: string): Promise<Topic[]> {
  const response = await fetch(`${API_ENDPOINTS.topics}?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('주제 검색에 실패했습니다.');
  }
  return response.json();
}
