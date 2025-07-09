import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Message")
export class Message {
  @Field(() => Number)
  id: number

  @Field(() => String)
  message: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  // TODO：リレーションフィールドを追加
}