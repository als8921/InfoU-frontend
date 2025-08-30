import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "@/components/navigation/NavigationBar";

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
        <NavigationBar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
