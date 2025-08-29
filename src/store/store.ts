import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { wizardSlice, WizardSlice } from "./wizard-slice";
import { articleSlice, ArticleSlice } from "./article-slice";
import { uiSlice, UISlice } from "./ui-slice";

// 루트 스토어 타입
export type RootStore = WizardSlice & ArticleSlice & UISlice;

// 루트 스토어 생성
export const useStore = create<RootStore>()(
  devtools(
    persist(
      (...a) => ({
        ...wizardSlice(...a),
        ...articleSlice(...a),
        ...uiSlice(...a),
      }),
      {
        name: "info-u-store",
        // 세션 지속할 상태만 선택
        partialize: (state) => ({
          topicSlug: state.topicSlug,
          level: state.level,
        }),
      }
    ),
    {
      name: "info-u-store",
    }
  )
);
