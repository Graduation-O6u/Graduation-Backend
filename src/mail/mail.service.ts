import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(name, email, code: string, template: string) {
    await this.mailerService.sendMail({
      from: "fhakem75@gmail.com",
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      //   template: `./${template}`, // `.hbs` extension is appended automatically
      text: "Welcome NestJS Email Sending Tutorial",
    });
  }
}
