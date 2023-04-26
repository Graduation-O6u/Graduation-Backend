import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, isArray } from "class-validator";

export class addJobDto {
  @IsNotEmpty()
  @ApiProperty()
  jobType: string;

  @IsNotEmpty()
  @ApiProperty()
  jobLocationType: string;

  @IsNotEmpty()
  @ApiProperty()
  salary: number;

  @IsNotEmpty()
  @ApiProperty()
  salaryPer: string;

  @IsNotEmpty()
  @ApiProperty()
  jobLocationId: string;

  @IsNotEmpty()
  @ApiProperty({
    isArray: true,
  })
  jobSkillId: string;

  @IsNotEmpty()
  @ApiProperty()
  jobTitleId: string;

  @IsNotEmpty()
  @ApiProperty()
  jobDescription: string;
}
//
