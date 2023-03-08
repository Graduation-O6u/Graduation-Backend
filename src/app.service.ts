import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ResponseController } from "./util/response.controller";

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
}
