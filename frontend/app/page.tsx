import { redirect } from "next/navigation";

export default function Home() {
  // デフォルトのチャンネル（雑談）にリダイレクト
  // TODO：もっといい方法ありそう
  redirect("/channels/1");
}
