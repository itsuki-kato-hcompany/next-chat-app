import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("User")
export class User {
  @Field(() => Number)
  id: number

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

  @Field(() => String, { nullable: true })
  profileImgPath: string | null

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}