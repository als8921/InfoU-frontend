import { Metadata } from "next";
import { Button } from "../../../_components/Button";
import { Card } from "../../../_components/Card";
import { LEVEL_LABELS, LEVEL_COLORS } from "../../../_data/contracts";

interface ReadPageProps {
  params: {
    id: string;
  };
  searchParams: {
    level?: string;
  };
}

export async function generateMetadata({
  params,
}: ReadPageProps): Promise<Metadata> {
  return {
    title: `글 읽기 - ${params.id} | InfoU`,
    description: "InfoU에서 학습 글을 읽어보세요.",
  };
}

export default function ReadPage({ params, searchParams }: ReadPageProps) {
  const { id } = params;
  const { level = "beginner" } = searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">글 제목</h1>
              <p className="text-gray-600">현재 글 ID: {id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">난이도:</span>
                <select
                  className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
                  defaultValue={level}
                >
                  <option value="beginner">입문</option>
                  <option value="intermediate">중급</option>
                  <option value="expert">전문가</option>
                </select>
              </div>
              <Button variant="outline" size="sm">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                설정
              </Button>
            </div>
          </div>
        </div>

        {/* 글 본문 */}
        <Card className="mb-8 shadow-xl">
          <div className="prose prose-lg max-w-none">
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    LEVEL_COLORS[level as keyof typeof LEVEL_COLORS]
                  }`}
                >
                  {LEVEL_LABELS[level as keyof typeof LEVEL_LABELS]}
                </span>
                <span className="text-sm text-gray-500">• 3분 읽기</span>
              </div>
              <p className="text-gray-700 font-medium">
                이 글에서는 선택하신 주제에 대해{" "}
                {LEVEL_LABELS[level as keyof typeof LEVEL_LABELS]} 수준으로
                설명드립니다.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              여기에 글 본문이 들어갑니다. 현재 글 ID: {id}, 난이도: {level}
            </p>

            <p className="text-gray-700 leading-relaxed text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </Card>

        {/* 네비게이션 */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="lg">
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
            이전 글
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">진행률</div>
              <div className="text-lg font-semibold text-gray-900">3 / 10</div>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-3/10 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
            </div>
          </div>

          <Button variant="primary" size="lg">
            다음 글
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
          </Button>
        </div>
      </div>
    </div>
  );
}
