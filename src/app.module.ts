import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { LoggerMiddleware } from "./Middlewares/Logger";
import { AuthModule } from "./auth/auth.module";
import { UploadModule } from "./upload/upload.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailModule } from "./mail/mail.module";
import { MailService } from "./mail/mail.service";
import { JobsModule } from './jobs/jobs.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UploadModule, MailModule, JobsModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
