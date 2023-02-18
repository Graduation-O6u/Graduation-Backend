import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ValidationPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUser } from "./dto/create-auth.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { loginDto } from "./dto/login.dto";
import { verifyDto } from "./dto/verify.dto";
import { forgetDto } from "./dto/forget.dto";
import { changePasswordDto } from "./dto/changePassword.dto";
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  signup(
    @Res() res: Response,
    @Body(ValidationPipe) createAuthDto: createUser
  ) {
    return this.authService.signup(res, createAuthDto);
  }
  // signin
  @Post("/signin")
  signin(@Res() res: Response, @Body(ValidationPipe) loginDto: loginDto) {
    return this.authService.signin(res, loginDto);
  }

  @Get("/cities")
  getCities(@Res() res: Response) {
    return this.authService.getCities(res);
  }

  @Get("/jobs")
  getJobs(@Res() res: Response) {
    return this.authService.getJobs(res);
  }

  @Post("/verify-email/:id")
  async verifyEmail(
    @Param("id") id: string,
    @Res() res,
    @Body(ValidationPipe) verifyDto: verifyDto
  ) {
    return this.authService.verify(id, res, verifyDto);
  }

  @Post("/forgetPassword")
  async forgetPassword(@Res() res, @Body(ValidationPipe) forgetDto: forgetDto) {
    return this.authService.forgetPassword(res, forgetDto);
  }

  @Post("/reset-password/:id")
  async resetPassword(
    @Param("id") id: string,
    @Res() res,
    @Body(ValidationPipe) verifyDto: verifyDto
  ) {
    return this.authService.resetPassword(id, res, verifyDto);
  }
  @Post("/change_password/:id")
  async changePassword(
    @Param("id") id: string,
    @Res() res,
    @Body(ValidationPipe) changePasswordDto: changePasswordDto
  ) {
    return this.authService.changePassword(id, res, changePasswordDto);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/logout")
  async logout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }
}
//
