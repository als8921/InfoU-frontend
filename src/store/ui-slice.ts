import { StateCreator } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface UISlice {
  // 상태
  globalLoading: boolean;
  globalError?: string;
  toast?: Toast;
  
  // 액션
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  clearToast: () => void;
  reset: () => void;
}

const initialState = {
  globalLoading: false,
  globalError: undefined,
  toast: undefined,
};

export const uiSlice: StateCreator<UISlice> = (set, get) => ({
  ...initialState,
  
  setLoading: (loading: boolean) => {
    set({ globalLoading: loading });
  },
  
  setError: (error?: string) => {
    set({ globalError: error });
  },
  
  showToast: (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000,
    };
    
    set({ toast: newToast });
    
    // 자동 제거
    setTimeout(() => {
      const currentToast = get().toast;
      if (currentToast?.id === id) {
        set({ toast: undefined });
      }
    }, newToast.duration);
  },
  
  clearToast: () => {
    set({ toast: undefined });
  },
  
  reset: () => {
    set(initialState);
  },
});
