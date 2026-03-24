import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClient } from "@/lib/urqlServer";
import { GetMyChannelsDocument } from "../src/generated/documents";
import type { GetMyChannelsQuery, GetMyChannelsQueryVariables } from "../src/generated/types";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const client = getClient(token);
  const result = await client
    .query<GetMyChannelsQuery, GetMyChannelsQueryVariables>(
      GetMyChannelsDocument,
      { limit: 1 }
    )
    .toPromise();

  const firstChannel = result?.data?.myChannels?.[0];

  if (firstChannel) {
    redirect(`/channels/${firstChannel.id}`);
  }

  // 参加チャンネルがない場合
  redirect("/channels");
}
