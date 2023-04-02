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
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags, ApiBasicAuth } from "@nestjs/swagger";
import { editUserDto } from "./dto/editUser.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/")
  getUser(@Req() req, @Res() res) {
    return this.userService.getUser(req, res);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Patch("/")
  editUser(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) editUserDto: editUserDto
  ) {
    return this.userService.editUser(req, res, editUserDto);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/deleteCv")
  deleteCv(@Req() req, @Res() res) {
    return this.userService.deleteCv(req, res);
  }
}
