import { Field, InputType, Int } from "@nestjs/graphql";

@InputType("CreateMessageInput")
export class CreateMessageInput {
  @Field(() => String)
  message: string;

  // TODO：リレーション定義追加後にnot nullに変更
  @Field(() => Int, { nullable: true })
  userId: number;

  // TODO：リレーション定義追加後にnot nullに変更
  @Field(() => Int, { nullable: true })
  channelId: number;
}