# 📄 InfoU 프론트엔드 PRD v1.0

## 1. 프로젝트 개요

- **목표:**  
  사용자가 대주제를 선택하고 LLM으로 개인화된 소주제를 생성받아, 5단계 난이도별 동적 커리큘럼을 통한 맞춤형 학습 경험 제공

- **플랫폼:**  
  Next.js 15 (App Router) + TypeScript + Tailwind CSS + Zustand + React Query

- **핵심 가치:**
  - LLM 기반 개인화 소주제 생성
  - 5단계 세분화 난이도 (완전초심자 → 전문가)
  - 실시간 커리큘럼 & 아티클 생성
  - 생성 진행상황 실시간 피드백

---

## 2. 핵심 사용자 플로우

1. **홈 화면(/)** → 대주제 선택
2. **소주제 생성** → LLM 기반 개인화 또는 큐레이션 선택
3. **5단계 난이도 선택** → 완전초심자/초심자/중급자/고급자/전문가
4. **커리큘럼 생성 대기** → 실시간 진행상황 표시 (WebSocket)
5. **학습 시작** → 첫 글 보기(/learn/[session_id])
6. **학습 진행** → 글 상세, 난이도 전환, 다음 글 (동적 생성)

---

## 3. 주요 기능 요구사항

### 3.1 메인 위저드 (홈페이지)

**Step 1: 대주제 선택**

- 큐레이션된 대주제 카드형 레이아웃
- 검색 기능 (300ms 디바운스)
- 인기/최신 대주제 필터링

**Step 2: 소주제 생성/선택**

```typescript
interface SubTopicOption {
  type: "curated" | "generated" | "mixed";
  label: string;
  description: string;
}
```

- **큐레이션 소주제**: 검증된 인기 소주제 표시
- **개인화 생성**: 사용자 관심사 입력 → LLM 생성
- **혼합 모드**: 큐레이션 + 생성 조합

**Step 3: 5단계 난이도 선택**

```typescript
type Level =
  | "absolute_beginner"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

interface LevelCard {
  code: Level;
  name: string;
  description: string;
  targetAudience: string;
  estimatedTime: string; // "주 3-4시간"
}
```

### 3.2 생성 대기 화면

**실시간 진행상황**

- WebSocket 연결로 생성 진행률 실시간 표시
- 단계별 상태: 소주제 분석 → 커리큘럼 생성 → 첫 글 생성
- 예상 완료 시간 표시
- 생성 실패 시 재시도 옵션

**프로그레스 UI**

```typescript
interface GenerationStatus {
  sessionId: string;
  status:
    | "analyzing"
    | "generating_curriculum"
    | "generating_articles"
    | "ready"
    | "error";
  progress: {
    curriculum: "pending" | "processing" | "completed";
    articles: number; // 생성된 아티클 수
    total: number; // 전체 아티클 수
  };
  estimatedCompletion: string;
  currentStep: string; // "AI가 머신러닝 커리큘럼을 설계하고 있어요..."
}
```

### 3.3 학습 화면 (/learn/[session_id])

**글 상세 뷰**

- 아티클 본문 (300-500자)
- 현재 진행률 (3/10)
- 5단계 난이도 전환 (즉시 반영)
- 글 품질 피드백 (👍/👎)

**네비게이션**

- 이전/다음 글 버튼
- 커리큘럼 전체 보기 (사이드바)
- 학습 중단/재개 기능

**적응형 학습**

- 사용자 피드백 기반 난이도 자동 조정 제안
- 이해도 체크 (간단한 퀴즈)
- 관련 주제 추천

### 3.4 전역 상태 관리 (Zustand)

**wizardSlice**

```typescript
interface WizardState {
  // 단계별 상태
  step: "main_topic" | "sub_topic" | "level" | "generating";

  // 선택된 내용
  mainTopic: MainTopic | null;
  subTopicMode: "curated" | "generated" | "mixed";
  selectedSubTopics: SubTopic[];
  level: Level;
  userInterests: string[]; // 개인화 생성용

  // 생성 상태
  sessionId: string | null;
  generationStatus: GenerationStatus | null;

  // 액션
  setMainTopic: (topic: MainTopic) => void;
  setSubTopicMode: (mode: string) => void;
  setLevel: (level: Level) => void;
  startGeneration: () => Promise<void>;
  reset: () => void;
}
```

**learningSlice**

```typescript
interface LearningState {
  sessionId: string | null;
  currentArticleId: string | null;
  curriculum: CurriculumItem[] | null;
  currentLevel: Level;

  // 학습 진행
  completedArticles: Set<string>;
  bookmarks: Set<string>;
  feedbacks: Record<string, "like" | "dislike">;

  // 액션
  setCurrentArticle: (id: string) => void;
  switchLevel: (level: Level) => void;
  markCompleted: (id: string) => void;
  addFeedback: (id: string, feedback: "like" | "dislike") => void;
}
```

**connectionSlice** (WebSocket 관리)

```typescript
interface ConnectionState {
  wsConnection: WebSocket | null;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  lastMessage: any;

  connect: (sessionId: string) => void;
  disconnect: () => void;
  subscribe: (callback: (data: any) => void) => void;
}
```

---

## 4. 라우팅 구조

- `/` : 메인 위저드 (대주제 → 소주제 → 난이도 선택)
- `/generate/[sessionId]` : 생성 진행상황 화면
- `/learn/[sessionId]` : 학습 메인 화면
- `/learn/[sessionId]/[articleId]` : 특정 글 상세 (딥링크)

---

## 5. 데이터 계약 (TypeScript Interfaces)

### 5.1 기본 엔티티

```typescript
interface MainTopic {
  id: number;
  slug: string;
  name: string;
  description: string;
  popularity: number;
  estimatedLearningTime: string;
}

interface SubTopic {
  id: string; // "curated_1" or "generated_123"
  mainTopicId: number;
  slug: string;
  name: string;
  description: string;
  sourceType: "curated" | "llm_generated";
  qualityScore?: number;
  usageCount?: number;
}

interface Level {
  code:
    | "absolute_beginner"
    | "beginner"
    | "intermediate"
    | "advanced"
    | "expert";
  name: string;
  description: string;
  targetAudience: string;
  characteristics: string[];
  estimatedHoursPerWeek: number;
}
```

### 5.2 학습 관련

```typescript
interface Curriculum {
  sessionId: string;
  title: string;
  level: Level["code"];
  totalItems: number;
  estimatedTotalTime: string;
  items: CurriculumItem[];
}

interface CurriculumItem {
  id: string;
  order: number;
  title: string;
  summary: string;
  estimatedReadTime: string; // "2-3분"
  isGenerated: boolean;
  generatedAt?: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  level: Level["code"];
  nextArticleId?: string;
  previousArticleId?: string;

  // 메타데이터
  readTime: string;
  wordCount: number;
  generatedAt: string;
  llmModel: string;

  // 관련 정보
  keyTerms: string[];
  relatedTopics: string[];
  difficultyIndicators: string[];
}
```

### 5.3 사용자 입력

```typescript
interface PersonalizationInput {
  interests: string[];
  currentLevel: Level["code"];
  learningGoals: string;
  timeAvailability: "casual" | "regular" | "intensive";
  preferredStyle: "theoretical" | "practical" | "mixed";
}

interface GenerationRequest {
  mainTopicId: number;
  subTopicIds: string[];
  level: Level["code"];
  personalization?: PersonalizationInput;
  maxArticles?: number;
}
```

---

## 6. 상태/URL 동기화 규칙

### 6.1 위저드 단계

- 각 단계별 URL 쿼리 파라미터 동기화
- `/?main=ai&step=sub_topic`
- `/?main=ai&sub=llm,transformer&level=intermediate`

### 6.2 생성 과정

- 세션 생성 시 `/generate/[sessionId]`로 이동
- WebSocket 연결로 실시간 상태 동기화
- 생성 완료 시 `/learn/[sessionId]`로 자동 이동

### 6.3 학습 과정

- 현재 아티클 URL: `/learn/[sessionId]/[articleId]?level=intermediate`
- 난이도 전환 시 URL 업데이트 + 새 콘텐츠 로딩
- 새로고침 시 세션 기반 상태 복원

---

## 7. 폴더 구조

```
src/
├── app/
│   ├── layout.tsx                 # 전역 레이아웃
│   ├── page.tsx                   # 메인 위저드
│   ├── generate/
│   │   └── [sessionId]/
│   │       └── page.tsx           # 생성 진행상황
│   └── learn/
│       └── [sessionId]/
│           ├── page.tsx           # 학습 대시보드
│           └── [articleId]/
│               └── page.tsx       # 글 상세보기
├── components/
│   ├── wizard/
│   │   ├── MainTopicSelector.tsx
│   │   ├── SubTopicGenerator.tsx
│   │   └── LevelSelector.tsx
│   ├── generation/
│   │   ├── ProgressTracker.tsx
│   │   └── GenerationStatus.tsx
│   ├── learning/
│   │   ├── ArticleViewer.tsx
│   │   ├── CurriculumSidebar.tsx
│   │   └── LevelSwitcher.tsx
│   └── ui/                        # 공용 UI 컴포넌트
├── hooks/
│   ├── useWebSocket.ts
│   ├── useGeneration.ts
│   └── useLearning.ts
├── store/
│   ├── index.ts
│   ├── wizard-slice.ts
│   ├── learning-slice.ts
│   └── connection-slice.ts
├── services/
│   ├── api.ts                     # API 클라이언트
│   ├── websocket.ts               # WebSocket 관리
│   └── storage.ts                 # 로컬 스토리지 유틸
└── types/
    ├── api.ts                     # API 응답 타입
    ├── entities.ts                # 도메인 엔티티
    └── ui.ts                      # UI 상태 타입
```

---

## 8. 성능 최적화

### 8.1 로딩 최적화

- **초기 로딩**: 메인 위저드 ≤ 2초
- **생성 대기**: 진행상황 실시간 업데이트 (WebSocket)
- **글 로딩**: 아티클 생성 ≤ 3초, 캐시된 글 ≤ 500ms

### 8.2 상태 관리 최적화

- Zustand 셀렉터로 불필요한 리렌더링 방지
- React Query로 서버 상태 캐싱 및 동기화
- 아티클 무한 스크롤 구현 (react-window)

### 8.3 사용자 경험 최적화

- Optimistic Updates (난이도 전환, 북마크)
- 오프라인 대응 (Service Worker + 읽은 글 캐싱)
- 뒤로가기/앞으로가기 히스토리 관리

---

## 9. 접근성 & 반응형

### 9.1 접근성 (WCAG 2.1 AA)

- 키보드 네비게이션 지원
- 스크린 리더 호환 (aria-label, role 적용)
- 색상 대비 4.5:1 이상
- 포커스 표시 명확화

### 9.2 반응형 디자인

- **모바일 우선**: 375px 기준 설계
- **태블릿**: 768px (사이드바 접기/펴기)
- **데스크톱**: 1024px+ (멀티 컬럼 레이아웃)

---

## 10. 에러 처리 & 품질 게이트

### 10.1 에러 시나리오

- 생성 실패 시 재시도 옵션
- 네트워크 오류 시 오프라인 모드
- 세션 만료 시 복원 안내
- WebSocket 연결 끊김 시 폴링 대안

### 10.2 테스트 시나리오

- **기본 플로우**: 주제 선택 → 생성 → 학습 완주
- **딥링크**: `/learn/sess123/art456?level=expert` 직접 접근
- **난이도 전환**: 모든 단계에서 즉시 반영
- **오프라인**: 읽은 글 오프라인 접근 가능
- **느린 네트워크**: 생성 시간 5분+ 시에도 UX 유지

---

## 11. 성공 지표

### 11.1 핵심 KPI

- **완료율**: 커리큘럼 시작 → 50% 이상 완독
- **생성 성공률**: 커리큘럼 생성 요청 → 성공적 완료 95%+
- **사용자 만족도**: 글 품질 피드백 긍정 70%+
- **성능**: 페이지 로드 2초 이내 90%+

### 11.2 사용자 행동 분석

- 선호 난이도별 학습 패턴
- 개인화 vs 큐레이션 선택 비율
- 중간 이탈 지점 및 원인 분석
- 난이도 전환 빈도 및 방향

---

✅ **결론**
개인화된 LLM 생성 컨텐츠와 5단계 세분화 난이도를 통해 사용자별 최적화된 학습 경험 제공. 실시간 생성 과정의 투명성과 적응형 학습 시스템으로 사용자 몰입도와 완성도 극대화.
