import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}
  async getAll(req, res, query) {
    const notification = await this.prisma.notification.findMany({
      where: {
        userId: req.user.userObject.id,
      },
      select: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      skip: parseInt(query.skip) || 0,
      take: +query.take || 10,
    });
    const size = await this.prisma.notification.count({
      where: {
        userId: req.user.userObject.id,
      },
    });
    await this.prisma.notification.updateMany({
      where: {
        userId: req.user.userObject.id,
        read: false,
      },
      data: {
        read: true,
      },
    });
    return ResponseController.success(res, "Get data Successfully", {
      notification,
      size,
    });
  }
  async unRead(req, res) {
    const size = await this.prisma.notification.count({
      where: {
        userId: req.user.userObject.id,
        read: false,
      },
    });
    return ResponseController.success(
      res,
      "Get Data Successfully",
      size.toString
    );
  }
}
