import { Injectable } from "@nestjs/common";
import { createUser } from "./dto/create-auth.dto";
import { ResponseController } from "src/static/responses";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { loginDto } from "./dto/login.dto";
import { tokenService } from "./token.service";
import fetch from "node-fetch";
import { MailService } from "src/mail/mail.service";
import * as speakeasy from "speakeasy";
import e from "express";
import { url } from "inspector";
import * as pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import * as pdfText from "pdf-text";
import * as pdf from "pdf-text-extract";
import * as fs from "fs";
import path, { join } from "path";
import { createCompany } from "./dto/create-company.dto";
import { Role } from "@prisma/client";
import { cites } from "src/util/cities";
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService,
    private mail: MailService
  ) {}
  async getPdf(file, userId: string) {
    let readFileSync = fs.readFileSync(file);
    try {
      let pdfExtract = await pdfParse(readFileSync);
      const skills = await this.prisma.skills.findMany();
      for (let i = 0; i < skills.length; i += 1) {
        if (pdfExtract.text.includes(skills[i].skill)) {
          await this.prisma.userSkills.create({
            data: {
              userId: userId,
              skillId: skills[i].id,
            },
          });
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  // signip
  async signup(res, createUser: createUser) {
    const { name, email, password, jobId, cityId, cv } = createUser;
    console.log(name, email, password, jobId, cityId, cv);
    const emailExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExist)
      return ResponseController.conflict(res, "Email already exist");

    const jobExist = await this.prisma.jobTitle.findUnique({
      where: {
        id: jobId,
      },
    });

    //
    //
    if (!jobExist) return ResponseController.conflict(res, "Job not exist");

    const hashPassword = await bcrypt.hash(password, 8);

    ////
    const apiSecret = join(process.cwd(), `${cv.split("v1/")[1]}`);

    //
    const newUser = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        cityId: cityId,
        jobId: jobId,
        cv: cv,
        aboutme: "",
      },
    });
    this.getPdf(apiSecret, newUser.id);

    ////////

    const secret = speakeasy.generateSecret().base32;
    const code = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    await this.mail.sendUserConfirmation(
      name,
      email,
      `${process.env.BASE_URL}/auth/verify-email/${secret}`,
      code.toString(),
      "confirmation"
    );
    await this.prisma.secret.create({
      data: {
        userId: newUser.id,
        url: secret,
        code: code.toString(),
      }, //
    });
    return ResponseController.success(res, "user created Successfully", {
      secret,
    });
  } //////////////////////
  //ss//////

  async signupCompany(res, createCompanyDto: createCompany) {
    const {
      name,
      email,
      password,
      locationCode,
      history,
      jobId,
      marketingValue,
      websiteUrl,
    } = createCompanyDto;

    let cities;
    cities = Object.keys(cites).map((key) => cites[key]);

    const emailExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExist)
      return ResponseController.conflict(res, "Email already exist");

    const jobExist = await this.prisma.jobTitle.findUnique({
      where: {
        id: jobId,
      },
    });

    //
    //
    if (!jobExist) return ResponseController.conflict(res, "Job not exist");

    const hashPassword = await bcrypt.hash(password, 8);
    const newUser = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        jobId: jobId,
        aboutme: "",
        role: "COMPANY",
      },
    });
    await this.prisma.companyDetails.create({
      data: {
        companyId: newUser.id,
        history,
        marketingValue,
        websiteUrl,
      },
    });
    for (let i = 0; i < locationCode.length; i += 1) {
      await this.prisma.companyLocation.create({
        data: {
          code: locationCode[i],
          companyId: newUser.id,
          name: cities.find((x) => x.code === locationCode[i]).name,
        },
      });
    }
    const secret = speakeasy.generateSecret().base32;
    const code = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    await this.mail.sendUserConfirmation(
      name,
      email,
      `${process.env.BASE_URL}/auth/verify-email/${secret}`,
      code.toString(),
      "confirmation"
    );
    await this.prisma.secret.create({
      data: {
        userId: newUser.id,
        url: secret,
        code: code.toString(),
      }, //
    });
    return ResponseController.success(res, "user created Successfully", {
      secret,
    });
  }
  async signin(res, loginDto: loginDto) {
    const { email, password, remember } = loginDto;
    const emailExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        job: true,
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        image: true,
        password: true,
        role: true,
        createdAt: true,
        cityId: true,
        jobId: true,
        aboutme: true,
        github: true,
        behance: true,
        backgroundImage: true,
        cv: true,
      },
    });
    if (!emailExist)
      return ResponseController.badRequest(
        res,
        "IncorrectCredentials",
        "Incorrect email or password"
      );
    if (!emailExist.emailVerified) {
      return ResponseController.badRequest(
        res,
        "Email Not Verified",
        "Email Not Verified"
      );
    }
    const view = await this.prisma.views.count({
      where: {
        userId: emailExist.id,
      },
    });
    var cities;

    await fetch(
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
    )
      .then((response) => response.json())
      .then((data) => (cities = Object.keys(data).map((key) => data[key])));
    var city;
    cities.forEach((element) => {
      if (element["code"] == emailExist.cityId) {
        city = element["name"];
      }
    });
    const validPassword = await bcrypt.compare(password, emailExist.password);
    if (!validPassword) {
      return ResponseController.badRequest(
        res,
        "IncorrectCredentials",
        "Incorrect Email or Password"
      );
    } //
    if (!emailExist.emailVerified) {
      return ResponseController.badRequest(
        res,
        "EmailNotVerified",
        "Email not Verified"
      ); ////
    }
    const refreshToken = await this.tokenServices.createRefresh(
      emailExist,
      remember
    );
    const accessToken = await this.tokenServices.createAccess(
      emailExist,
      refreshToken.refreshId
    );
    return ResponseController.success(res, "Login successfully", {
      user: emailExist,
      view,
      city,
      accessToken,
      refreshToken: refreshToken.refreshToken,
    });
  }

  async getCities(res) {
    await fetch(
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
    )
      .then((response) => response.json())
      .then((data) =>
        ResponseController.success(
          res,
          "get Data Successfully",
          Object.keys(data).map((key) => data[key])
        )
      );
    /*   for (let i = 0; i < jobsData.length; i += 1) {
      await this.prisma.jobTitle.create({
        data: {
          title: jobsData[i],
        },
      });
    }
    for (let i = 0; i < skillsData.length; i += 1) {
      await this.prisma.skills.create({
        data: {
          skill: skillsData[i],
        },
      });
    }
    return ResponseController.success(res, "suc", null);*/
  }
  async getJobs(res) {
    const jobs = await this.prisma.jobTitle.findMany();
    return ResponseController.success(res, "get Data Successfully", jobs);
  }
  async addCities(data) {
    return Object.keys(data).map((key) => data[key]);
  }
  //g
  async verify(id, res, verifyDto) {
    const { code } = verifyDto;
    let secret = speakeasy.generateSecret().base32;
    const exist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(res, "page not Found");
    }

    const userExist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
      select: { user: true, code: true },
    });

    if (!userExist) {
      return ResponseController.badRequest(
        res,
        "user not found",
        "user not found"
      );
    }
    if (exist.code !== code) {
      return ResponseController.badRequest(res, "Invalid Code", "Invalid Code");
    }

    await this.prisma.user.update({
      where: {
        id: userExist.user.id,
      },
      data: {
        emailVerified: true,
      },
    });
    await this.prisma.secret.deleteMany({
      where: {
        userId: userExist.user.id,
      },
    });
    return ResponseController.success(res, "Email Verified Successfully", null);
  }

  async forgetPassword(res, forgetDto) {
    const { email } = forgetDto;
    const emailExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!emailExist) {
      return ResponseController.badRequest(
        res,
        "Email not found",
        "Email not found"
      );
    }
    if (!emailExist.emailVerified) {
      return ResponseController.badRequest(
        res,
        "Email not verified",
        "Email not verified"
      );
    }

    const secret = speakeasy.generateSecret().base32;
    const code = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    await this.prisma.secret.create({
      data: {
        userId: emailExist.id,
        code: code,
        url: secret,
        type: "PASSWORD_RESET",
      },
    });
    //
    await this.mail.sendUserConfirmation(
      emailExist.name,
      email,
      `${process.env.BASE_URL}/auth/reset-password/${secret}`,
      code.toString(),
      "confirmation"
    );
    return ResponseController.success(res, "code sent Successfully", {
      secret,
    });
  }

  async resetPassword(id, res, verifyDto) {
    const { code } = verifyDto;
    let secret = speakeasy.generateSecret().base32;
    const exist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(res, "page not Found");
    }

    const userExist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
      select: { user: true, code: true },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        "user not found",
        "user not found"
      );
    }
    if (userExist.code !== code) {
      return ResponseController.badRequest(res, "Invalid Code", "Invalid Code");
    }
    await this.prisma.secret.deleteMany({
      where: {
        userId: userExist.user.id,
      },
    });
    const url = process.env.BASE_URL + "/auth/change_password/" + secret;
    await this.prisma.secret.create({
      data: {
        code: code,
        url: secret,
        userId: userExist.user.id,
        type: "PASSWORD_RESET",
      },
    });
    return ResponseController.success(res, "Email Verified Successfully", {
      url,
      secret,
    });
  }
  async changePassword(id, res, changePasswordDto) {
    const { password } = changePasswordDto;
    let secret = speakeasy.generateSecret().base32;
    const exist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(res, "page not Found");
    }

    const userExist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
      select: { user: true, code: true },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        "user not found",
        "user not found"
      );
    }

    await this.prisma.secret.deleteMany({
      where: {
        userId: userExist.user.id,
      },
    });
    const hashPassword = await bcrypt.hash(password, 8);

    await this.prisma.user.update({
      where: {
        id: userExist.user.id,
      },
      data: {
        password: hashPassword,
      },
    });
    return ResponseController.success(
      res,
      "Password Change Successfully",
      null
    );
  }

  async logout(req, res) {
    const user = req.user.userObject.id;
    const token = req.user.jti;
    const found = await this.prisma.token.findFirst({
      where: { id: token, userId: user, type: "AccessToken" },
    });
    if (!found) return ResponseController.notFound(res, "token not found");
    await this.prisma.token.delete({ where: { id: found.refreshId } });
    await this.prisma.token.delete({
      where: { id: found.id },
    });
    return ResponseController.success(res, "Session destroyed successfully");
  }
  async googleAuth(res, req, body) {
    console.log("enter Google");
    const { email, name, image } = body;
    const userExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!userExist) {
      const hashPassword = await bcrypt.hash("*password123*", 8);

      const userData = await this.prisma.user.create({
        data: {
          name,
          image,
          email,
          emailVerified: true,
          password: hashPassword,
          aboutme: "",
          jobId: "",
        },
      });
      return ResponseController.created(res, "user created", userData);
    }
    const refreshToken = await this.tokenServices.createRefresh(
      userExist,
      true
    );
    const accessToken = await this.tokenServices.createAccess(
      userExist,
      refreshToken.refreshId
    );
    const view = await this.prisma.views.count({
      where: {
        userId: userExist.id,
      },
    });
    var cities;

    await fetch(
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
    )
      .then((response) => response.json())
      .then((data) => (cities = Object.keys(data).map((key) => data[key])));
    var city;
    cities.forEach((element) => {
      if (element["code"] == userExist.cityId) {
        city = element["name"];
      }
    });
    return ResponseController.success(res, "Login successfully", {
      user: userExist,
      view,
      city,
      accessToken,
      refreshToken,
    });
  }
}

//
////
