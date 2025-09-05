"use client";

import { useState, useEffect } from "react";
import { LearningPathListResponse, SubTopicResponse } from "@/types/api";
import { learningPathsService } from "@/services";

interface LearningPathSelectorProps {
  selectedSubTopic: SubTopicResponse;
  onLearningPathSelect: (learningPath: LearningPathListResponse) => void;
  selectedLearningPath?: LearningPathListResponse | null;
}

export const LearningPathSelector = ({
  selectedSubTopic,
  onLearningPathSelect,
  selectedLearningPath,
}: LearningPathSelectorProps) => {
  const [learningPaths, setLearningPaths] = useState<LearningPathListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await learningPathsService.getLearningPaths(
          selectedSubTopic.sub_topic_id
        );
        setLearningPaths(response);
      } catch (err) {
        console.error("학습 경로 조회 실패:", err);
        setError("학습 경로를 불러올 수 없습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, [selectedSubTopic.sub_topic_id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            학습 경로를 준비하고 있습니다...
          </h2>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
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
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          학습 경로를 선택하세요
        </h2>
        <p className="text-gray-600">
          {selectedSubTopic.name}에 대한 다양한 학습 경로를 준비했습니다.
          <br />
          자신에게 맞는 학습 스타일을 선택해보세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <div
            key={path.path_id}
            className={`
              relative bg-white rounded-xl shadow-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-xl hover:-translate-y-1
              ${
                selectedLearningPath?.path_id === path.path_id
                  ? "border-blue-500 ring-4 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
            onClick={() => onLearningPathSelect(path)}
          >
            {selectedLearningPath?.path_id === path.path_id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {path.title}
                </h3>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {path.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
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
                  커리큘럼 {path.curriculum_count}개
                </div>

                <div className="flex items-center text-sm text-gray-500">
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
                  예상 시간 {path.estimated_hours}시간
                </div>
              </div>
            </div>

            <div
              className={`
                h-1 w-full rounded-b-xl transition-all duration-200
                ${
                  selectedLearningPath?.path_id === path.path_id
                    ? "bg-blue-500"
                    : "bg-gray-100"
                }
              `}
            />
          </div>
        ))}
      </div>

      {learningPaths.length === 0 && !loading && (
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
            준비된 학습 경로가 없습니다
          </h3>
          <p className="text-gray-500">
            곧 다양한 학습 경로를 준비해드리겠습니다.
          </p>
        </div>
      )}
    </div>
  );
};