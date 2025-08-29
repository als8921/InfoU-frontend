"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../_components/Card";
import { Button } from "../_components/Button";
import { SkeletonCard } from "../_components/Skeleton";
import { useStore } from "../store/store";
import { Level, LEVEL_LABELS, LEVEL_COLORS } from "../_data/contracts";
import { fetchTopics, fetchCurriculum } from "../_data/api";

export default function HomePage() {
  const router = useRouter();
  const {
    topicSlug,
    topicName,
    level,
    preview,
    isLoading,
    error,
    setTopic,
    setLevel,
    loadPreview,
    setLoading,
    setError,
  } = useStore();

  const [topics, setTopics] = useState<Array<{ slug: string; name: string }>>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTopics, setFilteredTopics] = useState<
    Array<{ slug: string; name: string }>
  >([]);

  // 주제 목록 로드
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        const topicsData = await fetchTopics();
        setTopics(topicsData);
        setFilteredTopics(topicsData);
      } catch (err) {
        setError("주제 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [setLoading, setError]);

  // 검색 필터링
  useEffect(() => {
    const filtered = topics.filter((topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTopics(filtered);
  }, [searchQuery, topics]);

  // 커리큘럼 미리보기 로드
  useEffect(() => {
    if (topicSlug && level) {
      const loadPreview = async () => {
        try {
          setLoading(true);
          const curriculum = await fetchCurriculum(topicSlug, level);
          useStore.getState().loadPreview(curriculum.items);
        } catch (err) {
          setError("커리큘럼을 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };

      loadPreview();
    }
  }, [topicSlug, level, setLoading, setError]);

  const handleTopicSelect = (slug: string, name: string) => {
    setTopic(slug, name);
  };

  const handleLevelSelect = (selectedLevel: Level) => {
    setLevel(selectedLevel);
  };

  const handleStartLearning = () => {
    if (preview.length > 0) {
      router.push(`/read/${preview[0].id}?level=${level}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-bounce-gentle inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              InfoU에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              원하는 주제를 선택하고 난이도에 맞는 학습을 시작하세요
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 주제 선택 */}
        <div className="animate-fade-in">
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">주제 선택</h2>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="주제를 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 text-lg placeholder-gray-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.slug}
                  onClick={() => handleTopicSelect(topic.slug, topic.name)}
                  className={`p-6 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                    topicSlug === topic.slug
                      ? "border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-lg"
                      : "border-gray-200 hover:border-primary-300 hover:bg-gray-50 bg-white"
                  }`}
                >
                  <div className="font-semibold text-lg">{topic.name}</div>
                  {topicSlug === topic.slug && (
                    <div className="mt-2 flex items-center text-primary-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      선택됨
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 난이도 선택 */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">난이도 선택</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["beginner", "intermediate", "expert"] as Level[]).map(
                (levelOption) => (
                  <button
                    key={levelOption}
                    onClick={() => handleLevelSelect(levelOption)}
                    className={`p-8 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                      level === levelOption
                        ? "border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 shadow-lg"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${LEVEL_COLORS[levelOption]}`}
                      >
                        {LEVEL_LABELS[levelOption]}
                      </div>
                      <div className="font-semibold text-gray-900 text-lg mb-2">
                        {levelOption === "beginner" && "기초부터 차근차근"}
                        {levelOption === "intermediate" && "실무에 바로 적용"}
                        {levelOption === "expert" && "심화 지식까지"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {levelOption === "beginner" &&
                          "처음 배우는 분들을 위한 기초 과정"}
                        {levelOption === "intermediate" &&
                          "실무에서 바로 활용할 수 있는 내용"}
                        {levelOption === "expert" && "전문가 수준의 심화 과정"}
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </Card>
        </div>

        {/* 커리큘럼 미리보기 */}
        {topicSlug && (
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  커리큘럼 미리보기
                </h2>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-600 text-center py-8 bg-red-50 rounded-lg border border-red-200">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-red-400"
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
                  {error}
                </div>
              ) : preview.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-6 bg-gray-50 px-4 py-3 rounded-lg">
                    총{" "}
                    <span className="font-semibold text-primary-600">
                      {preview.length}개
                    </span>
                    의 글로 구성된 커리큘럼입니다
                  </div>
                  {preview.slice(0, 5).map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {preview.length > 5 && (
                    <div className="text-center text-sm text-gray-500 bg-gray-50 py-4 rounded-lg">
                      ... 외{" "}
                      <span className="font-semibold">
                        {preview.length - 5}개
                      </span>{" "}
                      더
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
                  주제와 난이도를 선택하면 커리큘럼이 표시됩니다
                </div>
              )}
            </Card>
          </div>
        )}

        {/* 학습 시작 버튼 */}
        {topicSlug && preview.length > 0 && (
          <div
            className="text-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              onClick={handleStartLearning}
              variant="primary"
              size="lg"
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              학습 시작하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
