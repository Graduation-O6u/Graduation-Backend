import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsUrl,
} from "class-validator";

export class editUserDto {
  @MinLength(5)
  @MaxLength(32)
  @ApiProperty()
  name: string;

  @ApiProperty()
  github: string;

  @ApiProperty()
  behance: string;

  @ApiProperty()
  about: string;

  @ApiProperty()
  cityId: string;

  @ApiProperty()
  jobId: string;

  @ApiProperty()
  cv: string;
}
