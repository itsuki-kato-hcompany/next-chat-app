import { cookies } from "next/headers";
import { getClient } from "@/lib/urqlServer";
import { GetAvailableChannelsDocument } from "../../../src/generated/documents";
import type {
  GetAvailableChannelsQuery,
  GetAvailableChannelsQueryVariables,
} from "../../../src/generated/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return Response.json({ channels: [] }, { status: 401 });
  }

  const client = getClient(token);
  const result = await client
    .query<GetAvailableChannelsQuery, GetAvailableChannelsQueryVariables>(
      GetAvailableChannelsDocument,
      {}
    )
    .toPromise();

  const channels = (result?.data?.availableChannels || []).map(({ id, name }) => ({
    id,
    name,
  }));
  return Response.json({ channels });
}
