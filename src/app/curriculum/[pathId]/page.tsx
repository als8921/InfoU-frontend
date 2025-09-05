"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { learningPathsService, levelsService } from "@/services";
import {
  LearningPathDetailResponse,
  CurriculumItemResponse,
  LevelResponse,
  ArticleResponse,
} from "@/types/api";

export default function CurriculumPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathId = params.pathId as string;
  const selectedLevelCode = searchParams.get("level");

  const [learningPath, setLearningPath] =
    useState<LearningPathDetailResponse | null>(null);
  const [levels, setLevels] = useState<LevelResponse[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelResponse | null>(null);
  const [curriculumItems, setCurriculumItems] = useState<
    CurriculumItemResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 학습 경로 상세 정보와 레벨 정보를 병렬로 가져오기
        const [pathDetail, levelsData] = await Promise.all([
          learningPathsService.getLearningPathDetail(pathId),
          levelsService.getLevels(),
        ]);

        setLearningPath(pathDetail);
        setLevels(levelsData);

        // URL에서 level이 지정되어 있다면 해당 레벨을 선택
        if (selectedLevelCode) {
          const level = levelsData.find(
            (l) => l.code === selectedLevelCode
          );
          if (level) {
            setSelectedLevel(level);
          }
        }

        setCurriculumItems(pathDetail.curriculum_items);
      } catch (err) {
        console.error("데이터 조회 실패:", err);
        setError("학습 경로 정보를 불러올 수 없습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathId, selectedLevelCode]);

  const handleLevelSelect = (level: LevelResponse) => {
    setSelectedLevel(level);
    // URL 업데이트
    router.replace(`/curriculum/${pathId}?level=${level.code}`);
  };

  const handleCurriculumItemSelect = async (item: CurriculumItemResponse) => {
    if (!selectedLevel) {
      alert("먼저 난이도를 선택해주세요.");
      return;
    }

    // 해당 커리큘럼 아이템의 특정 난이도 글로 이동
    router.push(
      `/read/curriculum/${item.curriculum_item_id}?level=${selectedLevel.code}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">학습 경로를 준비하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            이전으로 돌아가기
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {learningPath.title}
            </h1>
            <p className="text-gray-600 mb-2">{learningPath.description}</p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                커리큘럼 {learningPath.curriculum_count}개
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                예상 시간 {learningPath.estimated_hours}시간
              </span>
            </div>
          </div>
        </div>

        {/* 난이도 선택 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            난이도를 선택하세요
          </h2>
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-3">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-200
                    ${
                      selectedLevel?.id === level.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      {level.order}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold">{level.name}</div>
                      <div className="text-xs text-gray-500">
                        {level.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 커리큘럼 아이템 목록 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            커리큘럼을 선택하세요
          </h2>

          {!selectedLevel && (
            <div className="text-center py-12">
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
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                난이도를 먼저 선택해주세요
              </h3>
              <p className="text-gray-500">
                선택한 난이도에 맞는 콘텐츠를 제공해드립니다.
              </p>
            </div>
          )}

          {selectedLevel && (
            <div className="grid gap-4">
              {curriculumItems.map((item, index) => (
                <div
                  key={item.curriculum_item_id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  onClick={() => handleCurriculumItemSelect(item)}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center mr-4">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                              />
                            </svg>
                            난이도: {selectedLevel.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedLevel && curriculumItems.length === 0 && (
            <div className="text-center py-12">
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
                준비된 커리큘럼이 없습니다
              </h3>
              <p className="text-gray-500">곧 다양한 커리큘럼을 준비해드리겠습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}