"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LevelSelector } from "@/components/LevelSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { LearningPathSelector } from "@/components/LearningPathSelector";
import {
  LevelResponse,
  MainTopicResponse,
  SubTopicResponse,
  LearningPathListResponse,
} from "@/types/api";

type Step = "welcome" | "topic" | "learning-path" | "level" | "summary";

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [selectedLevel, setSelectedLevel] = useState<LevelResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<MainTopicResponse | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopicResponse | null>(null);
  const [selectedLearningPath, setSelectedLearningPath] = 
    useState<LearningPathListResponse | null>(null);

  const handleLevelSelect = (level: LevelResponse) => {
    setSelectedLevel(level);
    setCurrentStep("summary");
  };

  const handleTopicSelect = (topic: MainTopicResponse) => {
    setSelectedTopic(topic);
    setSelectedSubTopic(null); // 대주제 변경 시 소주제 초기화
  };

  const handleSubTopicSelect = (subTopic: SubTopicResponse) => {
    setSelectedSubTopic(subTopic);
    setCurrentStep("learning-path");
  };

  const handleLearningPathSelect = (learningPath: LearningPathListResponse) => {
    setSelectedLearningPath(learningPath);
    setCurrentStep("level");
  };

  const startLearning = () => {
    // 선택된 정보를 바탕으로 커리큘럼 페이지로 이동
    if (selectedLearningPath && selectedLevel) {
      router.push(`/curriculum/${selectedLearningPath.path_id}?level=${selectedLevel.level_code}`);
    } else {
      // 필수 정보가 없는 경우
      alert("모든 선택을 완료해주세요.");
    }
  };

  const resetSelection = () => {
    setSelectedLevel(null);
    setSelectedTopic(null);
    setSelectedSubTopic(null);
    setSelectedLearningPath(null);
    setCurrentStep("welcome");
  };

  const goToLevelSelection = () => {
    setCurrentStep("level");
  };

  const goToTopicSelection = () => {
    if (selectedLevel) {
      setCurrentStep("topic");
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">InfoU</h1>
      <p className="text-xl text-gray-600 mb-8">
        AI 기반 개인화 학습으로
        <br />
        맞춤형 커리큘럼을 경험하세요
      </p>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              InfoU의 특징
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                5단계 난이도별 맞춤 학습
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                LLM 기반 동적 콘텐츠 생성
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                개인화된 학습 경로 제공
              </li>
            </ul>
          </div>
          <button
            onClick={() => setCurrentStep("topic")}
            className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
          >
            학습 시작하기
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgressBar = () => {
    const steps = [
      {
        key: "topic",
        label: "주제 선택",
        completed: !!selectedTopic && !!selectedSubTopic,
      },
      {
        key: "learning-path",
        label: "학습 경로",
        completed: !!selectedLearningPath,
      },
      { key: "level", label: "난이도 선택", completed: !!selectedLevel },
      { key: "summary", label: "학습 시작", completed: false },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : currentStep === step.key ||
                      (currentStep === "summary" && step.key === "summary")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }
              `}
              >
                {step.completed ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step.completed ||
                  currentStep === step.key ||
                  (currentStep === "summary" && step.key === "summary")
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-4 ${
                    step.completed ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSummaryStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          학습 준비 완료! 🎉
        </h2>
        <p className="text-gray-600">
          선택하신 설정으로 맞춤형 학습을 시작하겠습니다.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* 선택 요약 */}
        <div className="space-y-4">
          {selectedTopic && (
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">선택된 대주제</h3>
                <p className="text-gray-600">{selectedTopic.name}</p>
              </div>
            </div>
          )}

          {selectedSubTopic && (
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  선택된 세부 주제
                </h3>
                <p className="text-gray-600">{selectedSubTopic.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSubTopic.description}
                </p>
              </div>
            </div>
          )}

          {selectedLearningPath && (
            <div className="flex items-center p-4 bg-indigo-50 rounded-lg">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">선택된 학습 경로</h3>
                <p className="text-gray-600">{selectedLearningPath.title}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span className="mr-4">
                    커리큘럼 {selectedLearningPath.curriculum_count}개
                  </span>
                  <span>예상 시간 {selectedLearningPath.estimated_hours}시간</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xs">
                {selectedLevel?.level_code}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">선택된 난이도</h3>
              <p className="text-gray-600">
                {selectedLevel?.name} - {selectedLevel?.description}
              </p>
            </div>
          </div>
        </div>

        {/* 학습 목표 */}
        {selectedSubTopic?.learning_objectives &&
          selectedSubTopic.learning_objectives.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">학습 목표</h3>
              <ul className="space-y-2">
                {selectedSubTopic.learning_objectives.map(
                  (objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

        {/* 액션 버튼 */}
        <div className="flex space-x-4 pt-6">
          <button
            onClick={resetSelection}
            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            다시 선택하기
          </button>
          <button
            onClick={startLearning}
            className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
          >
            학습 시작하기
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentStep === "welcome" && renderWelcomeStep()}

        {currentStep !== "welcome" && (
          <>
            {renderProgressBar()}

            {currentStep === "topic" && (
              <TopicSelector
                onTopicSelect={handleTopicSelect}
                onSubTopicSelect={handleSubTopicSelect}
                selectedTopic={selectedTopic}
                selectedSubTopic={selectedSubTopic}
              />
            )}

            {currentStep === "learning-path" && selectedSubTopic && (
              <LearningPathSelector
                selectedSubTopic={selectedSubTopic}
                onLearningPathSelect={handleLearningPathSelect}
                selectedLearningPath={selectedLearningPath}
              />
            )}

            {currentStep === "level" && (
              <LevelSelector
                onLevelSelect={handleLevelSelect}
                selectedLevel={selectedLevel}
              />
            )}

            {currentStep === "summary" && renderSummaryStep()}

            {/* 네비게이션 버튼 */}
            {(currentStep === "topic" || currentStep === "learning-path" || currentStep === "level") && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => {
                    if (currentStep === "level") {
                      setCurrentStep("learning-path");
                    } else if (currentStep === "learning-path") {
                      setCurrentStep("topic");
                    } else if (currentStep === "topic") {
                      setCurrentStep("welcome");
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  이전 단계
                </button>

                {currentStep === "topic" && selectedSubTopic && (
                  <button
                    onClick={() => setCurrentStep("learning-path")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다음 단계
                  </button>
                )}

                {currentStep === "learning-path" && selectedLearningPath && (
                  <button
                    onClick={() => setCurrentStep("level")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다음 단계
                  </button>
                )}

                {currentStep === "level" && selectedLevel && (
                  <button
                    onClick={() => setCurrentStep("summary")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    선택 완료
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
