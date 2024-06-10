import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, isArray } from "class-validator";

export class sendLinkDto {
  @IsNotEmpty()
  @ApiProperty()
  link: string;
}
//

export class createMeetingDto {
  @IsNotEmpty()
  @ApiProperty()
  date: Date;
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
  @IsNotEmpty()
  @ApiProperty()
  companyId: string;
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
