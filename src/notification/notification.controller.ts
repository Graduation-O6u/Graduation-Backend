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
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { ApiTags, ApiBasicAuth, ApiQuery } from "@nestjs/swagger";

@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
    return this.notificationService.getAll(req, res, query);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/unReadNumber")
  async unRead(@Req() req, @Res() res) {
    return this.notificationService.unRead(req, res);
  }
}
