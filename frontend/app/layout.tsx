import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/header/header";
import { UrqlProvider } from "@/lib/urqlProvider";

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
        <UrqlProvider>
          {/* UrqlProviderでラップ */}
          {children}
          {/* ヘッダー */}
          <Header />
          {/* TODO：サイドバーlayoutかpageのどっちに配置した方がいいか検討 */}
          {children}
        </UrqlProvider>
      </body>
    </html>
  );
}
