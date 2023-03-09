import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  Patch,
  Req,
  ValidationPipe,
  Body,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { editUserDto } from "./dto/editUser.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("/")
  getUser(@Req() req, @Res() res) {
    return this.userService.getUser(req, res);
  }
  @Patch("/")
  editUser(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) editUserDto: editUserDto
  ) {
    return this.userService.editUser(req, res, editUserDto);
  }

  @Get("/deleteCv")
  deleteCv(@Req() req, @Res() res) {
    return this.userService.deleteCv(req, res);
  }
}
