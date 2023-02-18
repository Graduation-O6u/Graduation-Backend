import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class verifyDto {
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(5)
  @MaxLength(5)
  code: string;
}
//
