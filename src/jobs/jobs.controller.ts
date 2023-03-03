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
import { jobLocationType, jobType } from "@prisma/client";
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
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "comapny",
    type: String,
    required: false,
  })
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
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
      wayOfWork?: jobLocationType;
      jobType?: jobType;
      salary?: string;
      comapny?: string;
    }
  ) {
    return this.jobsService.jobs(req, res, query);
  }
  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id")
  async job(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.jobs(req, res, id);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id/bookmark")
  async bookmark(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.bookmark(req, res, id);
  }

  @ApiBasicAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Post("/:id")
  async applay(@Req() req, @Res() res, @Param("id") id: string) {
    return this.jobsService.applay(req, res, id);
  }
}
