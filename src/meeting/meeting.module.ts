import { Module } from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import { MeetingController } from "./meeting.controller";
import { PrismaService } from "src/prisma.service";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [MailModule],
  controllers: [MeetingController],
  providers: [MeetingService, PrismaService],
})
export class MeetingModule {}
