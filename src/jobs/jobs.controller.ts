import { JobsService } from "./jobs.service";
import { ApiBasicAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
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
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { searchDto } from "./dto/search.dto";
import { Role } from "@prisma/client";
import { Roles, RolesGuard } from "src/auth/guards/roles.guard";
import { addJobDto } from "./dto/addJob.dto";
import { meetingDto } from "./dto/meeting.dto";
@Controller("job")
@ApiTags("job")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
  @ApiQuery({
    name: "type",
    enum: ["FeaturedJobs", "RecommendedJobs", "Saved"],
    required: true,
  })
  @ApiQuery({
    name: "jobTitle",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "jobLocation",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "wayOfWork",
    enum: ["On_Site", "Hybird", "Remote"],
    required: false,
  })
  @ApiQuery({
    name: "jobType",
    enum: ["Part_Time", "Full_Time", "Internship"],
    required: false,
  })
  @ApiQuery({
    name: "salary",
    enum: ["less than 3000", "less than 6000", "less than 9000"],
    required: false,
  })
  @ApiQuery({
    name: "comapny",
    type: String,
    required: false,
  })
  @ApiBasicAuth("Access Token")
  @Roles(Role.USER)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Get("/all")
  async jobs(
    @Req() req,
    @Res() res,
    @Query()
    query: {
      skip?: string;
      take?: string;
      type: string;
      jobTitle?: string;
      jobLocation?: string;
      wayOfWork?: string;
      jobType?: string;
      salary?: string;
      comapny?: string;
    }
  ) {
    return this.jobsService.jobs(req, res, query);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Post("/search")
  async search(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) searchDto: searchDto
  ) {
    return this.jobsService.search(req, res, searchDto);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Post("/meetUser")
  async meet(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) meetingDto: meetingDto
  ) {
    return this.jobsService.meetUser(req, res, meetingDto);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id/Applicants")
  async jobApplicants(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.jobApplicants(req, res, id);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id")
  async job(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.job(req, res, id);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id/bookmark")
  async bookmark(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.bookmark(req, res, id);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Post("/:id/applay")
  async applay(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.applay(req, res, id);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Delete("/:id/deleteUser/:userId/Application")
  async deleteApplay(
    @Req() req,
    @Res() res,
    @Param("id") id: string,
    @Param("userId") userId: string
  ) {
    return this.jobsService.deleteApplay(req, res, id, userId);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.COMPANY)
  @Delete("/:id/delete")
  async deleteJob(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.deleteJob(req, res, id);
  }
  @ApiBasicAuth("Access Token")
  @Roles(Role.COMPANY)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("/")
  async addJob(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) addJobDto: addJobDto
  ) {
    return this.jobsService.addJob(req, res, addJobDto);
  }
}
