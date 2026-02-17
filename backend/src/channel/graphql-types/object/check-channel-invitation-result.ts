import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/graphql-types/object/user";

@ObjectType("CheckChannelInvitationResult")
export class CheckChannelInvitationResult {
  @Field(() => [User])
  validUsers: User[];

  @Field(() => [User])
  alreadyMemberUsers: User[];

  @Field(() => [Int])
  notFoundUserIds: number[];
}
