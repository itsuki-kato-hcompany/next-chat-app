import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/header/header";
import { UrqlProvider } from "@/lib/urqlProvider";
import { AuthProvider } from "@/lib/auth-context";

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
          <AuthProvider>
            {/* ヘッダー */}
            <Header />
            {children}
          </AuthProvider>
        </UrqlProvider>
      </body>
    </html>
  );
}
