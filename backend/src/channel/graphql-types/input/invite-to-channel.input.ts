import { Field, InputType, Int } from "@nestjs/graphql";
import { ArrayMaxSize } from "class-validator";

@InputType("InviteToChannelInput")
export class InviteToChannelInput {
  @Field(() => Int)
  channelId: number;

  @Field(() => [Int])
  @ArrayMaxSize(10, { message: "一度に招待できるユーザーは10人までです" })
  userIds: number[];
}
