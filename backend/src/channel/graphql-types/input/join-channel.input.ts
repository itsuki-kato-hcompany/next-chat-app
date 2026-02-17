import { Field, InputType, Int } from "@nestjs/graphql";

@InputType("JoinChannelInput")
export class JoinChannelInput {
  @Field(() => Int)
  channelId: number;
}
