"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { learningPathsService, levelsService } from "@/services";
import {
  ArticleResponse,
  NextPreviousArticleResponse,
  LevelResponse,
} from "@/types/api";
import { apiClient } from "@/services/api";

export default function ReadArticlePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const curriculumItemId = params.curriculumItemId as string;
  const levelCode = searchParams.get("level");

  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [levels, setLevels] = useState<LevelResponse[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextArticle, setNextArticle] = useState<NextPreviousArticleResponse | null>(null);
  const [previousArticle, setPreviousArticle] = useState<NextPreviousArticleResponse | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 레벨 정보 가져오기
        const levelsData = await levelsService.getLevels();
        setLevels(levelsData);

        // URL에서 level이 지정되어 있다면 해당 레벨을 선택
        if (levelCode) {
          const level = levelsData.find((l) => l.code === levelCode);
          if (level) {
            setSelectedLevel(level);
            // 해당 난이도의 글이 있는지 확인
            await fetchArticle(curriculumItemId, levelCode);
          }
        }
      } catch (err) {
        console.error("초기 데이터 조회 실패:", err);
        setError("페이지를 불러올 수 없습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [curriculumItemId, levelCode]);

  const fetchArticle = async (itemId: string, level: string) => {
    try {
      // API 명세에 따라 특정 난이도의 글 조회
      const response = await apiClient.get(`/api/curriculum-items/${itemId}/articles/${level}`);
      
      if (response.data) {
        setArticle(response.data);
        // 다음/이전 글 정보도 가져오기
        await fetchNavigationArticles(response.data.article_id, level);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // 글이 없는 경우 - 생성 옵션 제공
        setArticle(null);
      } else {
        console.error("글 조회 실패:", err);
        setError("글을 불러올 수 없습니다.");
      }
    }
  };

  const fetchNavigationArticles = async (articleId: string, level: string) => {
    try {
      const [nextRes, prevRes] = await Promise.allSettled([
        apiClient.get(`/api/articles/${articleId}/next?level=${level}`),
        apiClient.get(`/api/articles/${articleId}/previous?level=${level}`)
      ]);

      if (nextRes.status === 'fulfilled' && nextRes.value.data) {
        setNextArticle(nextRes.value.data);
      }
      if (prevRes.status === 'fulfilled' && prevRes.value.data) {
        setPreviousArticle(prevRes.value.data);
      }
    } catch (err) {
      console.error("네비게이션 글 조회 실패:", err);
    }
  };

  const generateArticle = async () => {
    if (!selectedLevel) return;

    try {
      setGenerating(true);
      setError(null);

      // API 명세에 따라 특정 난이도로 글 생성
      const response = await apiClient.post(`/api/curriculum-items/${curriculumItemId}/articles/generate`, {
        level: selectedLevel.code,
        content_style: "concise",
        word_count: 300
      });

      setArticle(response.data);
      // 생성된 글의 네비게이션 정보도 가져오기
      await fetchNavigationArticles(response.data.article_id, selectedLevel.code);
    } catch (err) {
      console.error("글 생성 실패:", err);
      setError("글을 생성할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setGenerating(false);
    }
  };

  const handleLevelChange = async (level: LevelResponse) => {
    setSelectedLevel(level);
    setArticle(null);
    setNextArticle(null);
    setPreviousArticle(null);
    
    // URL 업데이트
    router.replace(`/read/curriculum/${curriculumItemId}?level=${level.code}`);
    
    // 새 난이도의 글 조회
    await fetchArticle(curriculumItemId, level.code);
  };

  const markAsRead = async () => {
    if (!article) return;

    try {
      await apiClient.post(`/api/articles/${article.article_id}/read`);
      // 읽음 상태 업데이트
      setArticle(prev => prev ? {...prev, is_read: true} : null);
    } catch (err) {
      console.error("읽음 처리 실패:", err);
    }
  };

  const navigateToArticle = (targetArticle: NextPreviousArticleResponse) => {
    router.push(`/read/curriculum/${targetArticle.curriculum_item_id}?level=${targetArticle.level_code}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">페이지를 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="text-red-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              오류가 발생했습니다
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            커리큘럼으로 돌아가기
          </button>
        </div>

        {/* 난이도 선택 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">난이도 선택</h2>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelChange(level)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-all duration-200
                  ${
                    selectedLevel?.id === level.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        {!article && !generating && selectedLevel && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 준비된 글이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedLevel.name} 난이도로 새로운 글을 생성하시겠습니까?
            </p>
            <button
              onClick={generateArticle}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              AI로 글 생성하기
            </button>
          </div>
        )}

        {generating && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI가 글을 생성하고 있습니다...
            </h3>
            <p className="text-gray-500">
              {selectedLevel?.name} 난이도에 맞는 콘텐츠를 준비 중입니다.
            </p>
          </div>
        )}

        {article && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 글 헤더 */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                  {selectedLevel?.name}
                </span>
                {!article.is_read && (
                  <button
                    onClick={markAsRead}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    읽음으로 표시
                  </button>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {article.title}
              </h1>
            </div>

            {/* 글 내용 */}
            <div className="px-8 py-6">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.body?.replace(/\n/g, '<br>') || '' }}
              />
            </div>

            {/* 네비게이션 */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  {previousArticle && (
                    <button
                      onClick={() => navigateToArticle(previousArticle)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <div className="text-left">
                        <div className="text-xs text-gray-500">이전 글</div>
                        <div className="font-medium">{previousArticle.title}</div>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  {nextArticle && (
                    <button
                      onClick={() => navigateToArticle(nextArticle)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <div className="text-right">
                        <div className="text-xs text-gray-500">다음 글</div>
                        <div className="font-medium">{nextArticle.title}</div>
                      </div>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}