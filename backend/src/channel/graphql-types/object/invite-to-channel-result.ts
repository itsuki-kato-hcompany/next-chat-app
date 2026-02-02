import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Channel } from "./channel";

@ObjectType("InviteToChannelResult")
export class InviteToChannelResult {
  @Field(() => Channel)
  channel: Channel;

  @Field(() => [Int])
  invitedUserIds: number[];

  @Field(() => [Int])
  alreadyMemberUserIds: number[];

  @Field(() => [Int])
  notFoundUserIds: number[];
}
