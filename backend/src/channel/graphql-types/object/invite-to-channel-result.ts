import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/graphql-types/object/user";
import { Channel } from "./channel";

@ObjectType("InviteToChannelResult")
export class InviteToChannelResult {
  @Field(() => Channel)
  channel: Channel;

  @Field(() => [User])
  invitedUsers: User[];

  // フロント側でユーザー名・メールアドレスを表示する想定
  @Field(() => [User])
  alreadyMemberUsers: User[];

  @Field(() => [Int])
  notFoundUserIds: number[];
}
