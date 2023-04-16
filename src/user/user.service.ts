import { Injectable, Res } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/util/response.controller";
import fetch from "node-fetch";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(req, res) {
    const emailExist = await this.prisma.user.findUnique({
      where: {
        id: req.user.userObject.id,
      },
      select: {
        job: true,
        id: true,
        github: true,
        behance: true,
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
        backgroundImage: true,
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
        _count: {
          select: {
            userFollow: true,
          },
        },
      },
    });
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
  async editUser(req, res, editUserDto) {
    const { name, github, behance, about, cityId, jobId, cv, image } =
      editUserDto;

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
        image,
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
}
