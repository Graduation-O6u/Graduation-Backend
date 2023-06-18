import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  Query,
  Patch,
  Req,
  ValidationPipe,
  Body,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags, ApiBasicAuth, ApiQuery } from "@nestjs/swagger";
import { editUserDto } from "./dto/editUser.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles, RolesGuard } from "src/auth/guards/roles.guard";
import { Role } from "@prisma/client";
import { editImageDto } from "./dto/editImage.dto";
import { locationDto } from "./dto/location.dto";
import { editCompanyDto } from "./dto/editCompany.dto";
import { searchDataDto } from "./dto/searchUser.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({
    name: "type",
    enum: ["USER", "COMPANY"],
    required: true,
  })
  @ApiQuery({
    name: "skip",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "take",
    type: String,
    required: false,
  })
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/all")
  async getAll(
    @Req() req,
    @Res() res,
    @Query()
    query: {
      skip?: string;
      take?: string;
      type: string;
    }
  ) {
    return this.userService.getAll(req, res, query);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Patch("/profileImage")
  async profileImage(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) editImageDto: editImageDto
  ) {
    return this.userService.profileImage(req, res, editImageDto);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Patch("/backGroundImage")
  async backGroundImage(
    @Req() req,

    @Res() res,
    @Body(ValidationPipe) editImageDto: editImageDto
  ) {
    return this.userService.backGroundImage(req, res, editImageDto);
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
  @Patch("/company")
  editCompany(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) editCompanyDto: editCompanyDto
  ) {
    return this.userService.editCompany(req, res, editCompanyDto);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/deleteCv")
  deleteCv(@Req() req, @Res() res) {
    return this.userService.deleteCv(req, res);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Get("/CompanyLocations")
  CompanyLocations(@Req() req, @Res() res) {
    return this.userService.CompanyLocations(req, res);
  }
  @ApiQuery({
    name: "skip",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "take",
    type: String,
    required: false,
  })
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Get("/CompanyJobs")
  CompanyJobs(
    @Req() req,
    @Res() res,
    @Query()
    query: {
      skip?: string;
      take?: string;
    }
  ) {
    return this.userService.CompanyJobs(req, res, query);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Post("/CompanyLocations")
  addCompanyLocations(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) locationDto: locationDto
  ) {
    return this.userService.addCompanyLocations(req, res, locationDto);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Post("/search")
  search(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) searchDataDto: searchDataDto
  ) {
    return this.userService.search(req, res, searchDataDto);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Delete("/CompanyLocations")
  deleteCompanyLocations(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) locationDto: locationDto
  ) {
    return this.userService.deleteCompanyLocations(req, res, locationDto);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id")
  getUser(@Req() req, @Res() res, @Param("id") id: string) {
    return this.userService.getUser(req, res, id);
  }
}
