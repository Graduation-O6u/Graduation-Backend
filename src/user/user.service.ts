import { Injectable, Res } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/util/response.controller";
import fetch from "node-fetch";
import { Role } from "@prisma/client";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";
import path, { join } from "path";
import axios from "axios";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(req, res, id) {
    const emailExist = await this.prisma.user.findUnique({
      where: {
        id: id || req.user.userObject.id,
      },
      select: {
        job: true,
        id: true,
        github: true,
        behance: true,
        name: true,
        image: true,
        role: true,
        cityId: true,
        jobId: true,
        aboutme: true,
        backgroundImage: true,
        companyDetails: true,
        companyLocation: true,
        cv: true,
        userSkills: {
          select: {
            skills: {
              select: {
                id: true,
                skill: true,
              },
            },
          },
        },
      },
    });
    if (emailExist.role === Role.USER) {
      delete emailExist["companyDetails"];
      delete emailExist["companyLocation"];
    } else {
      delete emailExist["github"];
      delete emailExist["behance"];
      delete emailExist["behance"];
      delete emailExist["cv"];
      delete emailExist["userSkills"];
    }
    if (emailExist["id"] !== req.user.userObject.id) {
      const exist = await this.prisma.views.findUnique({
        where: {
          userId_viewId: {
            userId: id,
            viewId: req.user.userObject.id,
          },
        },
      });
      if (!exist) {
        await this.prisma.views.create({
          data: {
            userId: id,
            viewId: req.user.userObject.id,
          },
        });
      }
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
    emailExist["city"] = city;

    return ResponseController.success(res, "Get data Successfully", {
      user: emailExist,
      view,
    });
  }
  async getPdf(fileUrl, search) {
    console.log(search);
    try {
      // console.log("ss");

      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer", // Set the response type to arraybuffer
      });
      // console.log("//////////////////////////");
      // console.log(response);
      console.log(fileUrl);

      // console.log("ss1");

      const pdfBuffer = response.data;
      // console.log("ss2");

      const pdfExtract = await pdfParse(pdfBuffer);
      // console.log(pdfExtract.text.toString());
      // console.log(pdfExtract.text.includes(search));
      if (pdfExtract.text.toString().includes(search)) {
        console.log("yes");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async search(req, res, searchDto) {
    // const filePath = join(
    //   __dirname,
    //   "..",
    //   `/uploads/${id.split("uploads/")[0]}`
    // );

    const users = await this.prisma.user.findMany({
      where: {
        role: "USER",
      },

      select: {
        job: true,
        id: true,
        name: true,
        image: true,
        backgroundImage: true,
        aboutme: true,
        github: true,
        behance: true,

        cv: true,
      },
    });
    console.log(searchDto["searchData"]);
    const data = searchDto["searchData"];

    console.log("////////////");
    console.log(data);
    const { searchData } = searchDto;
    const searchedUsers = [];
    for (let i = 0; i < users.length; i += 1) {
      const x = await this.getPdf(users[i]["cv"], data);
      console.log(x);
      if (x) {
        searchedUsers.push(users[i]);
      }
    }
    return ResponseController.success(res, "Get data success", searchedUsers);
  }

  async editUser(req, res, editUserDto) {
    const { name, github, behance, about, cityId, jobId, cv } = editUserDto;

    await this.prisma.user.update({
      where: {
        id: req.user.userObject.id,
      },
      data: {
        name: name,
        github,
        behance,
        aboutme: about,
        cityId,
        jobId,
        cv,
      },
    });
    return ResponseController.success(res, "data get successfully", null);
  }
  async editCompany(req, res, editCompanyDto) {
    const { name, jobId, Url, about, history, marketingValue } = editCompanyDto;
    console.log(req.user.userObject["id"]);
    await this.prisma.user.update({
      where: {
        id: req.user.userObject.id,
      },
      data: {
        name,
        jobId,
        aboutme: about,
      },
    });
    await this.prisma.companyDetails.update({
      where: {
        companyId: req.user.userObject.id,
      },
      data: {
        history,
        marketingValue: marketingValue.toString(),
        websiteUrl: Url,
      },
    });
    return ResponseController.success(res, "data get successfully", null);
  }
  async deleteCv(req, res) {
    await this.prisma.user.update({
      where: {
        id: req.user.userObject.id,
      },
      data: {
        cv: "",
      },
    });
    return ResponseController.success(res, "data get successfully", null);
  }
  async profileImage(req, res, editImageDto) {
    const { image } = editImageDto;
    await this.prisma.user.update({
      where: {
        id: req.user.userObject.id,
      },
      data: {
        image,
      },
    });
    return ResponseController.success(res, "get data successfully", null);
  }

  async backGroundImage(req, res, editImageDto) {
    const { image } = editImageDto;
    await this.prisma.user.update({
      where: {
        id: req.user.userObject.id,
      },
      data: {
        backgroundImage: image,
      },
    });
    return ResponseController.success(res, "get data successfully", null);
  }
  async getAll(req, res, query) {
    const people = await this.prisma.user.findMany({
      where: {
        role: query.type,
      },
      skip: parseInt(query.skip) || 0,
      take: +query.take || 6,
      orderBy: { createdAt: "desc" }, //
      select: {
        job: true,
        id: true,
        name: true,
        image: true,
        backgroundImage: true,
        aboutme: true,
        github: true,
        behance: true,

        cv: true,
        companyDetails: true,
        companyLocation: true,
      },
    });
    if (query.type === Role.COMPANY) {
      delete people["github"];
      delete people["behance"];
      delete people["cv"];
    } else {
      delete people["companyDetails"];
      delete people["companyLocation"];
    }
    return ResponseController.success(res, "Get data Successfully", people);
  }
  async CompanyLocations(req, res) {
    const locations = await this.prisma.user.findUnique({
      where: {
        id: req.user.userObject.id,
      },
      select: {
        id: true,
        companyLocation: true,
      },
    });
    return ResponseController.success(res, "Get data Successfully", locations);
  }
  async addCompanyLocations(req, res, locationDto) {
    const { code, name } = locationDto;
    await this.prisma.companyLocation.create({
      data: {
        companyId: req.user.userObject.id,
        code,
        name,
      },
    });
    return ResponseController.created(res, "Add data Successfully", null);
  }

  async deleteCompanyLocations(req, res, locationDto) {
    const { code, name } = locationDto;
    const Company = await this.prisma.companyLocation.findFirst({
      where: {
        companyId: req.user.userObject.id,
        code,
        name,
      },
    });
    await this.prisma.companyLocation.delete({
      where: {
        id: Company.id,
      },
    });
    return ResponseController.success(res, "delete data Successfully", null);
  }
  async CompanyJobs(req, res, query) {
    const jobs = await this.prisma.jobs.findMany({
      skip: parseInt(query.skip) || 0,
      take: +query.take || 10,
      where: {
        companyId: req.user.userObject.id,
      },
      orderBy: { createdAt: "desc" }, //
      include: {
        jobTitle: true,

        company: true,
      }, ////
    });
    const size = await this.prisma.jobs.count({
      where: {
        companyId: req.user.userObject.id,
      },
    });

    return ResponseController.success(res, "Get Data Successfully", {
      jobs,
      size,
    });
  }
}
