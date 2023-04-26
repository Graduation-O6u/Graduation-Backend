import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";
import { Role } from "@prisma/client";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class MeetingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService
  ) {}

  async getAll(req, res, query) {
    let allMeetings;
    let size;
    if (req.user.userObject.role === Role.USER) {
      allMeetings = await this.prisma.meetings.findMany({
        where: {
          userId: req.userId,
        },
        skip: parseInt(query.skip) || 0,
        take: +query.take || 10,
        orderBy: { date: "desc" },
      });
      size = await this.prisma.meetings.count({
        where: {
          userId: req.userId,
        },
      });
    } else {
      allMeetings = await this.prisma.meetings.findMany({
        where: {
          companyId: req.userId,
        },
        skip: parseInt(query.skip) || 0,
        take: +query.take || 10,
        orderBy: { date: "desc" },
      });
      size = await this.prisma.meetings.count({
        where: {
          companyId: req.userId,
        },
      });
    }
    return ResponseController.success(res, "Get data Successfully", {
      allMeetings,
      size,
    });
  }
  async changeStatus(req, res, id, changeStatusDto) {
    const { status, description } = changeStatusDto;

    const meet = await this.prisma.meetings.update({
      where: {
        id,
      },
      data: {
        status,
        description,
      },
    });
    await this.prisma.notification.create({
      data: {
        userId: meet.userId,
        companyId: req.user.userObject.id,
        description: `${req.user.userJobs.name} changed the status of the meeting that was made with you`,
      },
    });
    return ResponseController.success(res, "Chnage data Successfully", null);
  }
  async sendLink(req, res, id, sendLinkDto) {
    const { link } = sendLinkDto;
    const data = await this.prisma.meetings.findUnique({
      where: {
        id,
      },
      include: {
        User: true,
      },
    });
    await this.mail.sendLink(data.User.name, data.User.email, link);
    return ResponseController.success(res, "Send Link Successfully", null);
  }
}
