import { Field, InputType, Int } from "@nestjs/graphql";

@InputType("CreateMessageInput")
export class CreateMessageInput {
  @Field(() => String)
  message: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  channelId: number;
}