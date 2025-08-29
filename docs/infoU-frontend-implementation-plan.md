# 📄 InfoU 프론트엔드 구현 계획서

## 1. 프로젝트 개요

- **목표:**  
  사용자가 원하는 주제를 선택하고, 난이도(입문/중급/전문가)에 따라 자동 생성된 학습 커리큘럼을 따라갈 수 있는 웹앱 제공
- **플랫폼:**  
  Next.js(App Router) + TypeScript + Tailwind CSS + Zustand
- **핵심 가치:**
  - 짧고 핵심적인 학습 글 (1~3분 분량)
  - 난이도별 동일 주제 학습 제공
  - 주제 선택 → 커리큘럼 생성 → 글 읽기라는 단순하고 직관적인 흐름

---

## 2. 핵심 사용자 플로우

1. **홈 화면(/)** → 주제 선택(검색/추천)
2. **난이도 선택** → 입문/중급/전문가
3. **커리큘럼 미리보기** → 글 리스트 생성
4. **학습 시작** → 첫 글 보기(/read/[id])
5. **글 상세 화면** → 본문 읽기, 난이도 전환, 다음 글 이동

---

## 3. 주요 기능 요구사항

### 3.1 홈(위저드)

- 주제 검색 (300ms 디바운스) 및 추천 리스트 제공
- 난이도 선택 (기본값: 입문)
- 커리큘럼 미리보기 (목록 3~10개, 요약 2줄 이내)
- “학습 시작” 클릭 시 `/read/[id]` 이동

### 3.2 글 상세 화면

- 글 본문 (300~500자, 1~3분 분량)
- 현재 난이도 표시 및 전환 가능
- “다음 글” 이동 버튼 제공
- 새로고침/딥링크 시 URL 기반으로 동일 화면 복원

### 3.3 전역 상태 관리(Zustand)

- **wizardSlice**

  - 상태: `topicSlug`, `topicName?`, `level`, `preview(list)`, `isLoading`, `error?`
  - 액션: `setTopic`, `setLevel`, `loadPreview`, `reset`
  - 세션 지속: `topicSlug`, `level`

- **articleSlice**

  - 상태: `currentId`, `nextId?`, `isLoading`, `error?`
  - 액션: `setCurrent`, `advanceNext`, `hydrateFromCurriculum`

- **uiSlice**

  - 상태: `globalLoading`, `globalError?`, `toast?`
  - 액션: `setLoading`, `setError`, `showToast`, `clearToast`

- 원칙: URL(라우팅)을 단일 진실원본으로, 스토어는 보조 수단으로 사용

---

## 4. 라우팅 구조

- `/` : 학습 위저드 (주제 → 난이도 → 커리큘럼 미리보기 → 시작)
- `/read/[id]` : 글 보기 (본문, 난이도 전환, 다음 글 이동)

---

## 5. 데이터 계약(Contracts)

- **Topic**

  ```json
  { "slug": "llm", "name": "LLM" }

  •	Curriculum
  ```

{
"title": "LLM 중급",
"level": "intermediate",
"items": [
{ "id": "101", "title": "Transformer 원리", "summary": "기본 구조와 self-attention" }
]
}

    •	Article

{
"id": "101",
"title": "Transformer 원리",
"body": "본문 내용...",
"nextId": "102"
}

⸻

6. 상태/URL 동기화 규칙
   • 위저드: 주제/난이도 선택 → 스토어 반영 + URL 쿼리(?level=...)
   • 글 상세: 난이도 전환 → URL 갱신 후 새 데이터 로딩
   • 새로고침/딥링크 시 URL만으로 동일 화면 복원 가능해야 함

⸻

7. 폴더 구조

src/
app/
layout.tsx # 전역 셸
page.tsx # 위저드
read/
[id]/
page.tsx # 글 보기
\_components/ # 공용 UI (버튼, 카드, 스켈레톤, 에러)
\_data/ # 데이터 계약/엔드포인트/페칭 규칙 문서
store/
store.ts # Zustand 루트
wizard-slice.ts # 주제·난이도 상태
article-slice.ts # 현재 글 상태
ui-slice.ts # UI 상태
public/
icons/\*

⸻

8. 성능·접근성·반응형
   • 성능
   • 초기 진입 ≤ 2초
   • 글 로딩 ≤ 1초
   • 스토어 셀렉터 최적화로 리렌더 최소화
   • 접근성
   • 포커스 이동 순서 문서화
   • 버튼/링크 역할·라벨 명시
   • 대비 비율 4.5:1 이상
   • 반응형
   • 모바일(375px) 기준 단일 컬럼
   • 데스크톱은 여백 확대, 내용 동일

⸻

9. 품질 게이트 (테스트 시나리오)
   • /read/[id]?level=expert 딥링크 → 정상 표시
   • 주제/난이도 변경 시 커리큘럼 재조회 & 로딩 표시
   • 네트워크 실패 시 에러 표시 + 재시도 동작
   • 새로고침 시 URL 기반으로 상태 복원
   • 느린 네트워크(3s 지연)에서도 UX 붕괴 없음

⸻

✅ 성공 검증
• 경로 2개로 단순 플로우 완성
• URL 우선 정책 + Zustand 보조로 복원성 확보
• 성능/접근성/에러 처리 규약 포함
• 코드 없이도 팀 합의 가능한 실행 계획서 완성
