"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const startLearning = () => {
    router.push("/read/sample");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">InfoU</h1>
          <p className="text-xl text-gray-600 mb-8">
            원하는 주제를 선택하고 맞춤형 학습을 시작하세요
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            학습 위저드
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주제 선택
              </label>
              <input
                type="text"
                placeholder="예: LLM, 머신러닝, 프로그래밍..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                난이도 선택
              </label>
              <div className="flex space-x-4">
                <button className="flex-1 py-3 px-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  입문
                </button>
                <button className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  중급
                </button>
                <button className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  전문가
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                커리큘럼 미리보기
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium text-gray-900">1. 기초 개념</h4>
                  <p className="text-sm text-gray-600">기본 개념과 용어를 학습합니다.</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium text-gray-900">2. 실습 예제</h4>
                  <p className="text-sm text-gray-600">간단한 예제를 통해 실습해봅니다.</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium text-gray-900">3. 심화 학습</h4>
                  <p className="text-sm text-gray-600">더 깊이 있는 내용을 다룹니다.</p>
                </div>
              </div>
            </div>

            <button
              onClick={startLearning}
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
            >
              학습 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
