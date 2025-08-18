import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("Channel")
export class Channel {
  @Field(() => Number)
  id: number

  @Field(() => String)
  name: string

  @Field(() => Boolean)
  isArchive: boolean

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Number)
  creatorId: number

  @Field(() => Number)
  updaterId: number
}