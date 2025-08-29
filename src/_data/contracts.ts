// 데이터 계약 정의

export interface Topic {
  slug: string;
  name: string;
}

export interface CurriculumItem {
  id: string;
  title: string;
  summary: string;
}

export interface Curriculum {
  title: string;
  level: 'beginner' | 'intermediate' | 'expert';
  items: CurriculumItem[];
}

export interface Article {
  id: string;
  title: string;
  body: string;
  nextId?: string;
}

export type Level = 'beginner' | 'intermediate' | 'expert';

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: '입문',
  intermediate: '중급',
  expert: '전문가'
};

export const LEVEL_COLORS: Record<Level, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  expert: 'bg-red-100 text-red-800'
};
