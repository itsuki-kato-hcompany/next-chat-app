import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class PaginationArgs {
  @Field(() => Number, { nullable: true, defaultValue: 50 })
  limit?: number = 50

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  offset?: number = 0
}