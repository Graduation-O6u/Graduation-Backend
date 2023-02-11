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
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUser } from "./dto/create-auth.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { loginDto } from "./dto/login.dto";
@ApiTags("auth")
@Controller("/")
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

  //  @ApiBearerAuth("Access Token")
  // @UseGuards(AuthGuard("jwt"))
  @Get("/cities")
  getCities(@Res() res: Response) {
    return this.authService.getCities(res);
  }

  @Get("/jobs")
  getJobs(@Res() res: Response) {
    return this.authService.getJobs(res);
  }
}
