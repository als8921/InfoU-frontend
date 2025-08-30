"use client";

import React, { useState, useEffect } from "react";
import { LevelWithStats } from "../types/api";
import { levelsService } from "../services/levels";

interface LevelSelectorProps {
  onLevelSelect: (level: LevelWithStats) => void;
  selectedLevel?: LevelWithStats | null;
  className?: string;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  onLevelSelect,
  selectedLevel,
  className = "",
}) => {
  const [levels, setLevels] = useState<LevelWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await levelsService.getLevelsWithStats();
        // order 필드로 정렬
        const sortedData = data.sort((a, b) => a.order - b.order);
        setLevels(sortedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "난이도 정보를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("Failed to fetch levels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const getDifficultyColor = (order: number) => {
    const colors = [
      "bg-green-50 border-green-200 text-green-800 hover:bg-green-100", // 1단계
      "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100", // 2단계
      "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100", // 3단계
      "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100", // 4단계
      "bg-red-50 border-red-200 text-red-800 hover:bg-red-100", // 5단계
    ];
    return colors[order - 1] || colors[0];
  };

  const getSelectedColor = (order: number) => {
    const colors = [
      "bg-green-500 border-green-500 text-white", // 1단계
      "bg-blue-500 border-blue-500 text-white", // 2단계
      "bg-yellow-500 border-yellow-500 text-white", // 3단계
      "bg-orange-500 border-orange-500 text-white", // 4단계
      "bg-red-500 border-red-500 text-white", // 5단계
    ];
    return colors[order - 1] || colors[0];
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            학습 난이도를 선택하세요
          </h2>
          <p className="text-gray-600">
            본인의 수준에 맞는 난이도를 선택해주세요
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            난이도 정보를 불러오는 중...
          </span>
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
          학습 난이도를 선택하세요
        </h2>
        <p className="text-gray-600">
          본인의 수준에 맞는 난이도를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {levels.map((level) => {
          const isSelected = selectedLevel?.id === level.id;
          const colorClass = isSelected
            ? getSelectedColor(level.order)
            : getDifficultyColor(level.order);

          return (
            <div
              key={level.id}
              onClick={() => onLevelSelect(level)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 
                transform hover:scale-105 hover:shadow-lg
                ${colorClass}
                ${isSelected ? "ring-4 ring-blue-200 scale-105 shadow-lg" : ""}
              `}
            >
              {/* 난이도 레벨 표시 */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold opacity-75">
                  LEVEL {level.order}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
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

              {/* 난이도 제목 */}
              <h3 className="text-xl font-bold mb-2">{level.name}</h3>

              {/* 난이도 설명 */}
              <p className="text-sm opacity-90 mb-4 line-clamp-2">
                {level.description}
              </p>

              {/* 대상 */}
              <div className="mb-4">
                <span className="text-xs font-medium opacity-75">대상:</span>
                <p className="text-sm font-medium">{level.target_audience}</p>
              </div>

              {/* 특징 */}
              <div className="mb-4">
                <span className="text-xs font-medium opacity-75">특징:</span>
                <ul className="text-sm space-y-1 mt-1">
                  {level.characteristics.slice(0, 2).map((char, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="line-clamp-1">{char}</span>
                    </li>
                  ))}
                  {level.characteristics.length > 2 && (
                    <li className="text-xs opacity-75">
                      +{level.characteristics.length - 2}개 더
                    </li>
                  )}
                </ul>
              </div>

              {/* 통계 정보 */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex space-x-4">
                  <span>주제 {level.main_topics_count}개</span>
                  <span>소주제 {level.curated_sub_topics_count}개</span>
                </div>
                <span>{level.estimated_hours_per_week}시간/주</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 선택된 난이도 요약 */}
      {selectedLevel && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            선택된 난이도: {selectedLevel.name}
          </h3>
          <p className="text-blue-800 mb-3">{selectedLevel.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <span className="font-medium">주간 학습시간:</span>
              <span className="ml-1">
                {selectedLevel.estimated_hours_per_week}시간
              </span>
            </div>
            <div>
              <span className="font-medium">대주제:</span>
              <span className="ml-1">{selectedLevel.main_topics_count}개</span>
            </div>
            <div>
              <span className="font-medium">소주제:</span>
              <span className="ml-1">
                {selectedLevel.curated_sub_topics_count}개
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
