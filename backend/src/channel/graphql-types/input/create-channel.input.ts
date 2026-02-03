import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MaxLength } from "class-validator";

@InputType("CreateChannelInput")
export class CreateChannelInput {
  @Field(() => String)
  @IsNotEmpty({ message: "チャンネル名は必須です" })
  @MaxLength(20, { message: "チャンネル名は20文字以内で入力してください" })
  name: string;
}
