import { cookies } from "next/headers";
import { getClient } from "@/lib/urqlServer";
import { InviteToChannelDocument } from "../../../src/generated/documents";
import type {
  InviteToChannelMutation,
  InviteToChannelMutationVariables,
} from "../../../src/generated/types";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { channelId, userIds } = await request.json();

  if (!channelId || typeof channelId !== "number") {
    return Response.json({ error: "channelId is required" }, { status: 400 });
  }

  if (!Array.isArray(userIds) || userIds.length === 0 || userIds.length > 10) {
    return Response.json(
      { error: "userIds must be an array of 1-10 user IDs" },
      { status: 400 }
    );
  }

  const client = getClient(token);
  const result = await client
    .mutation<InviteToChannelMutation, InviteToChannelMutationVariables>(
      InviteToChannelDocument,
      { input: { channelId, userIds } }
    )
    .toPromise();

  if (result.error) {
    return Response.json({ error: result.error.message }, { status: 500 });
  }

  return Response.json({
    invitedUsers: result.data?.inviteToChannel.invitedUsers || [],
    alreadyMemberUsers: result.data?.inviteToChannel.alreadyMemberUsers || [],
    notFoundUserIds: result.data?.inviteToChannel.notFoundUserIds || [],
  });
}
