import { Sidebar } from "@/components/sidebar/sidebar";
import { getClient } from "@/lib/urqlServer";
import { GetChannelsDocument } from "../../src/generated/documents";
import type { GetChannelsQuery, GetChannelsQueryVariables } from "../../src/generated/types";

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

  const client = getClient();

  // バックエンドからチャンネル一覧を取得
  const channelsResult = await client.query<GetChannelsQuery, GetChannelsQueryVariables>(
    GetChannelsDocument,
    {}
  ).toPromise();

  const channels = channelsResult?.data?.channels || [];

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