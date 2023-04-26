import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, isArray } from "class-validator";

export class sendLinkDto {
  @IsNotEmpty()
  @ApiProperty()
  link: string;
}
//
