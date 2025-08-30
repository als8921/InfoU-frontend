"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MainTopicResponse,
  CuratedSubTopicWithRelations,
  LevelWithStats,
} from "../types/api";
import { topicsService } from "../services/topics";

interface TopicSelectorProps {
  selectedLevel: LevelWithStats;
  onTopicSelect: (topic: MainTopicResponse) => void;
  onSubTopicSelect: (subTopic: CuratedSubTopicWithRelations) => void;
  selectedTopic?: MainTopicResponse | null;
  selectedSubTopic?: CuratedSubTopicWithRelations | null;
  className?: string;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedLevel,
  onTopicSelect,
  onSubTopicSelect,
  selectedTopic,
  selectedSubTopic,
  className = "",
}) => {
  const [mainTopics, setMainTopics] = useState<MainTopicResponse[]>([]);
  const [subTopics, setSubTopics] = useState<CuratedSubTopicWithRelations[]>(
    []
  );
  const [popularSubTopics, setPopularSubTopics] = useState<
    CuratedSubTopicWithRelations[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 대주제 목록 로드
  useEffect(() => {
    const fetchMainTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await topicsService.getMainTopics({
          page: currentPage,
          size: 20,
          search: searchQuery || undefined,
        });
        setMainTopics(response.items);
        setTotalPages(response.pages);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "주제 정보를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("Failed to fetch main topics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMainTopics();
  }, [currentPage, searchQuery]);

  // 인기 소주제 로드 (난이도가 선택되었을 때)
  useEffect(() => {
    const fetchPopularSubTopics = async () => {
      try {
        const popular = await topicsService.getPopularCuratedSubTopics(
          selectedLevel.code,
          6
        );
        setPopularSubTopics(popular);
      } catch (err) {
        console.error("Failed to fetch popular sub topics:", err);
      }
    };

    if (selectedLevel) {
      fetchPopularSubTopics();
    }
  }, [selectedLevel]);

  // 특정 대주제의 소주제 로드
  useEffect(() => {
    const fetchSubTopics = async () => {
      if (!selectedTopic) {
        setSubTopics([]);
        return;
      }

      try {
        setSubTopicsLoading(true);
        const subs = await topicsService.getCuratedSubTopicsByMainTopic(
          selectedTopic.id
        );
        // 선택된 난이도에 맞는 소주제만 필터링
        const filteredSubs = subs.filter(
          (sub) => sub.level_id === selectedLevel.id
        );
        setSubTopics(filteredSubs);
      } catch (err) {
        console.error("Failed to fetch sub topics:", err);
        setSubTopics([]);
      } finally {
        setSubTopicsLoading(false);
      }
    };

    fetchSubTopics();
  }, [selectedTopic, selectedLevel.id]);

  // 검색어 디바운싱
  const debouncedSearchQuery = useMemo(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // 검색 시 첫 페이지로 리셋
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTopicClick = (topic: MainTopicResponse) => {
    if (selectedTopic?.id === topic.id) {
      // 같은 주제를 다시 클릭하면 선택 해제
      onTopicSelect(null as any);
    } else {
      onTopicSelect(topic);
    }
  };

  const getDifficultyBadgeColor = (difficultyScore?: number) => {
    if (!difficultyScore) return "bg-gray-100 text-gray-600";
    if (difficultyScore <= 2) return "bg-green-100 text-green-600";
    if (difficultyScore <= 4) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  const getDifficultyText = (difficultyScore?: number) => {
    if (!difficultyScore) return "미지정";
    if (difficultyScore <= 2) return "쉬움";
    if (difficultyScore <= 4) return "보통";
    return "어려움";
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            학습 주제를 선택하세요
          </h2>
          <p className="text-gray-600">
            {selectedLevel.name} 난이도에 맞는 주제를 찾아보세요
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">주제 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          학습 주제를 선택하세요
        </h2>
        <p className="text-gray-600">
          <span className="font-semibold text-blue-600">
            {selectedLevel.name}
          </span>{" "}
          난이도에 맞는 주제를 찾아보세요
        </p>
      </div>

      {/* 인기 소주제 (대주제가 선택되지 않았을 때만 표시) */}
      {!selectedTopic && popularSubTopics.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔥 인기 학습 주제
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSubTopics.map((subTopic) => (
              <div
                key={subTopic.id}
                onClick={() => onSubTopicSelect(subTopic)}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {subTopic.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {subTopic.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getDifficultyBadgeColor(
                      subTopic.difficulty_score
                    )}`}
                  >
                    {getDifficultyText(subTopic.difficulty_score)}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>👥 {subTopic.popularity_score}</span>
                    {subTopic.estimated_duration_minutes && (
                      <span className="ml-2">
                        ⏱️ {subTopic.estimated_duration_minutes}분
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="관심 있는 주제를 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 대주제 목록 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 대주제</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainTopics.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`font-semibold ${
                      isSelected ? "text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {topic.title}
                  </h4>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {topic.description && (
                  <p
                    className={`text-sm ${
                      isSelected ? "text-blue-700" : "text-gray-600"
                    } line-clamp-2`}
                  >
                    {topic.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                이전
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 선택된 대주제의 소주제 목록 */}
      {selectedTopic && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 {selectedTopic.title}의 세부 주제
          </h3>

          {subTopicsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                세부 주제를 불러오는 중...
              </span>
            </div>
          ) : subTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subTopics.map((subTopic) => {
                const isSelected = selectedSubTopic?.id === subTopic.id;
                return (
                  <div
                    key={subTopic.id}
                    onClick={() => onSubTopicSelect(subTopic)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`font-semibold ${
                          isSelected ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        {subTopic.title}
                      </h4>
                      {isSelected && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {subTopic.description && (
                      <p
                        className={`text-sm ${
                          isSelected ? "text-green-700" : "text-gray-600"
                        } mb-3 line-clamp-2`}
                      >
                        {subTopic.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getDifficultyBadgeColor(
                          subTopic.difficulty_score
                        )}`}
                      >
                        {getDifficultyText(subTopic.difficulty_score)}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {subTopic.estimated_duration_minutes && (
                          <span>
                            ⏱️ {subTopic.estimated_duration_minutes}분
                          </span>
                        )}
                        <span>👥 {subTopic.popularity_score}</span>
                      </div>
                    </div>

                    {/* 키워드 */}
                    {subTopic.keywords && subTopic.keywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {subTopic.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            #{keyword}
                          </span>
                        ))}
                        {subTopic.keywords.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{subTopic.keywords.length - 3}개 더
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
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
              <p>
                이 주제에 대한 {selectedLevel.name} 난이도의 세부 주제가
                없습니다.
              </p>
              <p className="text-sm mt-1">다른 주제를 선택해보세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
