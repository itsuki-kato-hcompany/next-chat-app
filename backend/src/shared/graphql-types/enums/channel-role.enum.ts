import { registerEnumType } from "@nestjs/graphql";

export enum ChannelRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

registerEnumType(ChannelRole, {
  name: "ChannelRole",
  description: "チャンネル内のユーザーロール",
});
