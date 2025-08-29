import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InfoU - 맞춤형 학습 플랫폼",
  description:
    "원하는 주제를 선택하고 난이도에 맞는 학습을 시작하세요. InfoU에서 짧고 핵심적인 학습 글을 통해 효율적으로 지식을 습득하세요.",
  keywords: "학습, 교육, 커리큘럼, 온라인 강의, 자기계발",
  authors: [{ name: "InfoU Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
