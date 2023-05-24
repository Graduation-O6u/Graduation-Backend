import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, isArray } from "class-validator";

export class meetingDto {
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsNotEmpty()
  @ApiProperty()
  time: string;

  @IsNotEmpty()
  @ApiProperty()
  jobId: string;
}
//
