import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "微信读书 AI 助手",
  description: "连接微信读书账号，让 AI 助手随时查阅你的阅读记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
