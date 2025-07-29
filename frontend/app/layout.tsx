import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/header/header";

export const metadata: Metadata = {
  title: "リアルタイムチャット！",
  description: "Next.jsを使ったリアルタイムチャットアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* ヘッダー */}
        <Header />
        {/* TODO：サイドバーlayoutかpageのどっちに配置した方がいいか検討 */}
        {children}
      </body>
    </html>
  );
}
