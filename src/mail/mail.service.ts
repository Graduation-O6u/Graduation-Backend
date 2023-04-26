import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    name,
    email,
    url: string,
    code: string,
    template: string
  ) {
    await this.mailerService.sendMail({
      from: "fahd@prefectjob.com",
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      template: `./templates/confirmation.hbs`, // `.hbs` extension is appended automatically
      text: `Hey ${name} \n Please put this code ${code} \n in this url ${url}`,
    });
  }

  async sendMeet(name, email, company: string, day, time) {
    await this.mailerService.sendMail({
      from: "fahd@prefectjob.com",
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Meeting",
      template: `./templates/confirmation.hbs`, // `.hbs` extension is appended automatically
      text: `Hey ${name} \n ${company} want to meet you in this time ${day}:${time} \n The meeting link will be sent to you Five minutes before the meeting. \n please ,don't miss this opportunity`,
    });
  }
  async sendLink(name, email, link) {
    await this.mailerService.sendMail({
      from: "fahd@prefectjob.com",
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Meeting",
      template: `./templates/confirmation.hbs`, // `.hbs` extension is appended automatically
      text: `Hey ${name} \n this is the meeting Link ${link} \n The deadline for entry is within 10 minutes.`,
    });
  }
}
