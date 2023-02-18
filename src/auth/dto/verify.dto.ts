import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class verifyDto {
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
