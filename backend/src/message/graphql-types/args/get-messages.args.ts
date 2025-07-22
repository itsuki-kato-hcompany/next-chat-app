import { ArgsType, Field } from "@nestjs/graphql";
import { PaginationArgs } from "../../../shared/graphql-types/args/pagination.args";

@ArgsType()
export class GetMessagesArgs extends PaginationArgs {
  @Field(() => Number)
  channelId: number
}