import { cookies } from "next/headers";
import { getClient } from "@/lib/urqlServer";
import { GetInvitableUsersDocument } from "../../../src/generated/documents";
import type {
  GetInvitableUsersQuery,
  GetInvitableUsersQueryVariables,
} from "../../../src/generated/types";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return Response.json({ users: [] }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const channelId = Number(searchParams.get("channelId"));
  const query = searchParams.get("query") || "";

  if (!channelId || isNaN(channelId)) {
    return Response.json({ error: "channelId is required" }, { status: 400 });
  }

  const client = getClient(token);
  const result = await client
    .query<GetInvitableUsersQuery, GetInvitableUsersQueryVariables>(
      GetInvitableUsersDocument,
      { channelId, query }
    )
    .toPromise();

  if (result.error) {
    return Response.json({ error: result.error.message }, { status: 500 });
  }

  const users = (result?.data?.invitableUsers || []).map(
    ({ id, name, email, profileImgPath }) => ({
      id,
      name,
      email,
      profileImgPath,
    })
  );

  return Response.json({ users });
}
