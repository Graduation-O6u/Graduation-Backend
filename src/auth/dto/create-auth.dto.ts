import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class createUser {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
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
      "password must have at least 8 chars which should be between uppercase characters, lowercase characters and numbers",
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty()
  @IsNotEmpty()
  cv: string;
}
//
