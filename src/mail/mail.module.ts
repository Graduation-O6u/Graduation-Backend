import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { join } from "path";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "75d6be001@smtp-brevo.com",
          pass: "NjVHYFLKEP2OfQ1z",
        },
      },
    }),
  ],
  //
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
