import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ValidationPipe,
  Param,
  Req,
  Res,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles, RolesGuard } from "src/auth/guards/roles.guard";
import { Role } from "@prisma/client";
import { MeetingService } from "./meeting.service";
import { sendLinkDto } from "./dto/create-meeting.dto";
import { changeStatusDto } from "./dto/update-meeting.dto";
import { ApiTags, ApiBasicAuth, ApiQuery } from "@nestjs/swagger";

@Controller("meeting")
@ApiTags("meeting")
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

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
    }
  ) {
    return this.meetingService.getAll(req, res, query);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Patch("/:id/changeStatus")
  async changeStatus(
    @Req() req,
    @Res() res,
    @Param("id") id: string,
    @Body(ValidationPipe) changeStatusDto: changeStatusDto
  ) {
    return this.meetingService.changeStatus(req, res, id, changeStatusDto);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id/sendLink")
  async sendLink(
    @Req() req,
    @Res() res,
    @Param("id") id: string,
    @Body(ValidationPipe) sendLinkDto: sendLinkDto
  ) {
    return this.meetingService.sendLink(req, res, id, sendLinkDto);
  }
}
