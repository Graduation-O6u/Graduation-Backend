import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class searchDto {
  @IsNotEmpty()
  @ApiProperty()
  searchData: string;
}
//
