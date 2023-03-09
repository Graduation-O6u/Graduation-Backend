import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ResponseController } from "./util/response.controller";
import path, { join } from "path";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return "Hello World!";
  }
  async getCompany(res) {
    const company = await this.prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return ResponseController.success(
      res,
      "Get companies successfully",
      company
    );
  }
  async sendFile(res, id) {
    console.log(id.split("uploads/")[0]);
    console.log(__dirname);
    const filePath = join(
      __dirname,
      "..",
      `/uploads/${id.split("uploads/")[0]}`
    );

    res.sendFile(filePath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:", "fileName");
      }
    });
  }
}
////
//////////
////////////
////////
//////
//
////
//
//
//
//
//
//
