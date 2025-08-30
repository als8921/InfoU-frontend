"use client";

import { useRouter } from "next/navigation";
import { useState, use } from "react";

interface ReadPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReadPage({ params }: ReadPageProps) {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState("입문");
  const { id } = use(params);

  const handleLevelChange = (level: string) => {
    setCurrentLevel(level);
  };

  const goToNext = () => {
    const nextId = `next-${id}`;
    router.push(`/read/${nextId}`);
  };

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 상단 메타 정보 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={goHome}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← 홈으로
            </button>
            <div className="text-sm text-gray-500">
              글 ID: {id}
            </div>
          </div>
          
          {/* 난이도 전환 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">난이도:</span>
            <div className="flex space-x-1">
              {["입문", "중급", "전문가"].map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    currentLevel === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Transformer 원리 ({currentLevel} 수준)
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              {currentLevel === "입문" && "Transformer는 2017년에 등장한 딥러닝 모델 구조입니다. 기존의 RNN이나 CNN과 달리, 어텐션(Attention) 메커니즘만을 사용해서 문장의 의미를 파악합니다."}
              {currentLevel === "중급" && "Transformer는 self-attention과 multi-head attention을 핵심으로 하는 인코더-디코더 구조입니다. 각 단어가 문장 내 다른 모든 단어와 직접적으로 연결되어 병렬 처리가 가능합니다."}
              {currentLevel === "전문가" && "Transformer의 핵심은 scaled dot-product attention입니다. Query, Key, Value 행렬을 통해 attention(Q,K,V) = softmax(QK^T/√d_k)V 연산을 수행하며, 위치 임베딩과 layer normalization을 통해 안정적인 학습이 가능합니다."}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">핵심 포인트</h3>
              <ul className="space-y-2 text-blue-800">
                {currentLevel === "입문" && (
                  <>
                    <li>• 순차적이지 않고 병렬로 처리 가능</li>
                    <li>• 문장의 모든 단어를 동시에 고려</li>
                    <li>• 번역, 요약 등 다양한 태스크에 활용</li>
                  </>
                )}
                {currentLevel === "중급" && (
                  <>
                    <li>• Multi-head attention으로 다양한 관점 학습</li>
                    <li>• Positional encoding으로 위치 정보 제공</li>
                    <li>• Residual connection과 layer normalization 적용</li>
                  </>
                )}
                {currentLevel === "전문가" && (
                  <>
                    <li>• Attention weight의 계산 복잡도는 O(n²d)</li>
                    <li>• 경사도 소실 문제를 residual connection으로 해결</li>
                    <li>• Pre-LN vs Post-LN 구조의 차이와 안정성</li>
                  </>
                )}
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {currentLevel === "입문" && "이 구조는 현재 ChatGPT, BERT 등 대부분의 최신 AI 모델의 기반이 되고 있습니다."}
              {currentLevel === "중급" && "현재 GPT, BERT, T5 등 대부분의 언어모델이 Transformer 구조를 기반으로 하며, 컴퓨터 비전 분야에서도 ViT(Vision Transformer)로 확장되었습니다."}
              {currentLevel === "전문가" && "Transformer의 등장으로 대규모 pre-training과 fine-tuning 패러다임이 확립되었으며, 이는 foundation model과 emergent abilities의 기초가 되었습니다."}
            </p>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            3분 읽기 · 1/10
          </div>
          <button
            onClick={goToNext}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200"
          >
            다음 글 →
          </button>
        </div>
      </div>
    </div>
  );
}