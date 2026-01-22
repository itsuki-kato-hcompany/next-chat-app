import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/graphql-types/object/user';

@ObjectType()
export class AuthTokens {
  @Field()
  accessToken: string;
}

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field(() => AuthTokens)
  tokens: AuthTokens;
}
