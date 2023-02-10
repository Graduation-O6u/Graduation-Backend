import { Injectable } from "@nestjs/common";
import { createUser } from "./dto/create-auth.dto";
import { ResponseController } from "src/static/responses";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { loginDto } from "./dto/login.dto";
import { tokenService } from "./token.service";
import * as sgMail from "@sendgrid/mail";
import * as speakeasy from "speakeasy";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService
  ) {}
  // signip
  async signup(res, createUser: createUser) {
    const { name, email, password, jobId, cityId } = createUser;
    const emailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (emailExist)
      return ResponseController.conflict(res, "Email already exist");

    const cityExist = await this.prisma.cities.findUnique({
      where: {
        id: cityId,
      },
    });

    if (!cityExist) return ResponseController.conflict(res, "City not exist");

    const jobExist = await this.prisma.jobs.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!jobExist) return ResponseController.conflict(res, "Job not exist");

    const hashPassword = await bcrypt.hash(password, 8);
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        jobId,
        cityId,
      },
    });
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: newUser.email, // Change to your recipient
      from: "fhakem75@gmail.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    return ResponseController.success(res, "user created Successfully", null);
  }
  // signin
  async signin(res, loginDto: loginDto) {
    const { email, password } = loginDto;
    const emailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!emailExist)
      return ResponseController.badRequest(
        res,
        "IncorrectCredentials",
        "Incorrect email or password"
      );
    const validPassword = await bcrypt.compare(password, emailExist.password);
    if (!validPassword) {
      return ResponseController.badRequest(
        res,
        "IncorrectCredentials",
        "Incorrect Email or Password"
      );
    }
    if (!emailExist.emailVerified) {
      return ResponseController.badRequest(
        res,
        "EmailNotVerified",
        "Email not Verified"
      );
    }
    const refreshToken = await this.tokenServices.createRefresh(emailExist);
    const accessToken = await this.tokenServices.createAccess(
      emailExist,
      refreshToken.refreshId
    );
    return ResponseController.success(res, "Login successfully", {
      user: emailExist,
      accessToken,
      refreshToken: refreshToken.refreshToken,
    });
  }
}
