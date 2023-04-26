import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsUrl,
} from "class-validator";

export class editCompanyDto {
  @MinLength(5)
  @MaxLength(32)
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  about: string;

  @ApiProperty()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty()
  @IsNotEmpty()
  Url: string;

  @ApiProperty()
  @IsNotEmpty()
  history: string;

  @ApiProperty()
  @IsNotEmpty()
  marketingValue: number;
}
