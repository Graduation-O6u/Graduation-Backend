import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { LoggerMiddleware } from "./Middlewares/Logger";
import { AuthModule } from "./auth/auth.module";
import { UploadModule } from "./upload/upload.module";
import { MailModule } from "./mail/mail.module";
import { JobsModule } from "./jobs/jobs.module";
import { UserModule } from "./user/user.module";
import { MeetingModule } from "./meeting/meeting.module";
import { NotificationModule } from "./notification/notification.module";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./auth/stratiges/google.stratigy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "google" }),

    AuthModule,
    UploadModule,
    MailModule,
    JobsModule,
    UserModule,
    MeetingModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, GoogleStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
