import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../../user/graphql-types/object/user";
import { Channel } from "../../../channel/graphql-types/object/channel";

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

  @Field(() => User, { nullable: true })
  user?: User | null

  @Field(() => Channel, { nullable: true })
  channel?: Channel | null

  @Field(() => Number)
  userId: number

  @Field(() => Number)
  channelId: number
}