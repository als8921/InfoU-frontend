import { StateCreator } from 'zustand';
import { CurriculumItem } from '../_data/contracts';
import { Level } from '../_data/contracts';

export interface WizardSlice {
  // 상태
  topicSlug: string;
  topicName?: string;
  level: Level;
  preview: CurriculumItem[];
  isLoading: boolean;
  error?: string;
  
  // 액션
  setTopic: (slug: string, name?: string) => void;
  setLevel: (level: Level) => void;
  loadPreview: (items: CurriculumItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const initialState = {
  topicSlug: '',
  topicName: undefined,
  level: 'beginner' as Level,
  preview: [],
  isLoading: false,
  error: undefined,
};

export const wizardSlice: StateCreator<WizardSlice> = (set, get) => ({
  ...initialState,
  
  setTopic: (slug: string, name?: string) => {
    set({ topicSlug: slug, topicName: name, error: undefined });
  },
  
  setLevel: (level: Level) => {
    set({ level, error: undefined });
  },
  
  loadPreview: (items: CurriculumItem[]) => {
    set({ preview: items, isLoading: false, error: undefined });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  setError: (error?: string) => {
    set({ error, isLoading: false });
  },
  
  reset: () => {
    set(initialState);
  },
});
