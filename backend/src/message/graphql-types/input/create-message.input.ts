import { Field, InputType, Int } from "@nestjs/graphql";

@InputType("CreateMessageInput")
export class CreateMessageInput {
  @Field(() => String)
  message: string;

  @Field(() => Int, { nullable: true })
  userId: number;

  @Field(() => Int, { nullable: true })
  channelId: number;
}