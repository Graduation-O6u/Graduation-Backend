import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength, Matches } from "class-validator";

export class changePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      "password must have atleast 8 chars which should be between uppercase characters, lowercase characters, special characters, and numbers",
  })
  password: string;
}
