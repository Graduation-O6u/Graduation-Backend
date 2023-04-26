import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class createCompany {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, {
    message: "Not valid name",
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: "email not valid" })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      "password must have atleast 8 chars which should be between uppercase characters, lowercase characters, special characters, and numbers",
  })
  password: string;
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  locationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  history: string;

  @ApiProperty()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty()
  @IsNotEmpty()
  marketingValue: string;

  @ApiProperty()
  @IsNotEmpty()
  websiteUrl: string;
}
