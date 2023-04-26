import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class locationDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
