import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/graphql-types/object/user";

@ObjectType("ValidateChannelInvitationResult")
export class ValidateChannelInvitationResult {
  @Field(() => [User])
  validUsers: User[];

  // フロント側でユーザー名・メールアドレスを表示する想定
  @Field(() => [User])
  alreadyMemberUsers: User[];

  @Field(() => [Int])
  notFoundUserIds: number[];
}
