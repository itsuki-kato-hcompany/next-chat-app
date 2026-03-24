import { cookies } from "next/headers";
import { getClient } from "@/lib/urqlServer";
import { CreateChannelDocument } from "../../../src/generated/documents";
import type {
  CreateChannelMutation,
  CreateChannelMutationVariables,
} from "../../../src/generated/types";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return Response.json({ error: "チャンネル名は必須です" }, { status: 400 });
  }

  if (name.length > 20) {
    return Response.json(
      { error: "チャンネル名は20文字以内で入力してください" },
      { status: 400 }
    );
  }

  const client = getClient(token);
  const result = await client
    .mutation<CreateChannelMutation, CreateChannelMutationVariables>(
      CreateChannelDocument,
      { input: { name: name.trim() } }
    )
    .toPromise();

  if (result.error) {
    return Response.json({ error: result.error.message }, { status: 500 });
  }

  return Response.json({ channel: result.data?.createChannel });
}
