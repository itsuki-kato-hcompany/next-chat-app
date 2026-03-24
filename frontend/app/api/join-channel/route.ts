import { cookies } from "next/headers";
import { getClient } from "@/lib/urqlServer";
import { JoinChannelDocument } from "../../../src/generated/documents";
import type {
  JoinChannelMutation,
  JoinChannelMutationVariables,
} from "../../../src/generated/types";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { channelId } = await request.json();

  if (!channelId || typeof channelId !== "number") {
    return Response.json({ error: "channelId is required" }, { status: 400 });
  }

  const client = getClient(token);
  const result = await client
    .mutation<JoinChannelMutation, JoinChannelMutationVariables>(
      JoinChannelDocument,
      { input: { channelId } }
    )
    .toPromise();

  if (result.error) {
    return Response.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  return Response.json({ channel: result.data?.joinChannel });
}
