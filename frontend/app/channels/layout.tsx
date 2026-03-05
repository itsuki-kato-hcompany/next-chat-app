import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar/sidebar";
import { getClient } from "@/lib/urqlServer";
import { GetMyChannelsDocument } from "../../src/generated/documents";
import type { GetMyChannelsQuery, GetMyChannelsQueryVariables } from "../../src/generated/types";

interface ChannelsLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    channelId: string;
  }>;
}

export default async function ChannelsLayout({
  children,
  params
}: ChannelsLayoutProps) {
  const { channelId } = await params;
  const selectedChannelId = parseInt(channelId, 10);

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const client = getClient(token);

  // 参加済みチャンネル一覧を取得
  const channelsResult = await client.query<GetMyChannelsQuery, GetMyChannelsQueryVariables>(
    GetMyChannelsDocument,
    {}
  ).toPromise();

  const channels = channelsResult?.data?.myChannels || [];

  return (
    <div className="h-screen flex pt-16">
      <Sidebar
        selectedChannelId={selectedChannelId}
        channels={channels}
      />
      {children}
    </div>
  );
}