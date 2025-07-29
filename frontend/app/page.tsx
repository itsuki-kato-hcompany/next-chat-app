import { redirect } from "next/navigation";

export default function Home() {
  // デフォルトのチャンネル（雑談）にリダイレクト
  redirect("/channels/1");
}
