import { StateCreator } from 'zustand';

export interface ArticleSlice {
  // 상태
  currentId: string;
  nextId?: string;
  isLoading: boolean;
  error?: string;
  
  // 액션
  setCurrent: (id: string, nextId?: string) => void;
  advanceNext: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const initialState = {
  currentId: '',
  nextId: undefined,
  isLoading: false,
  error: undefined,
};

export const articleSlice: StateCreator<ArticleSlice> = (set, get) => ({
  ...initialState,
  
  setCurrent: (id: string, nextId?: string) => {
    set({ currentId: id, nextId, error: undefined });
  },
  
  advanceNext: () => {
    const { nextId } = get();
    if (nextId) {
      set({ currentId: nextId, nextId: undefined, error: undefined });
    }
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
