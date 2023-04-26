import { Module } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JobsController } from "./jobs.controller";
import { PrismaService } from "src/prisma.service";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [MailModule],
  controllers: [JobsController],
  providers: [JobsService, PrismaService],
})
export class JobsModule {}
//
//
//
