import { Controller, Get, Res, Param } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/company")
  getCompany(@Res() res) {
    return this.appService.getCompany(res);
  }
  @Get("/api/v1/upload/:id")
  sendFile(@Res() res, @Param("id") id: string) {
    return this.appService.sendFile(res, id);
  }
}
