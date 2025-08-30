import type { Metadata } from "next";
import "./globals.css";
import BottomNavigationBar from "@/components/navigation/BottomNavigationBar";

export const metadata: Metadata = {
  title: "InfoU - 맞춤형 학습 플랫폼",
  description: "InfoU에서 맞춤형 학습을 시작하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50">
        <main className="pb-20">
          {children}
        </main>
        <BottomNavigationBar />
      </body>
    </html>
  );
}
