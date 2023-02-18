import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class forgetDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
