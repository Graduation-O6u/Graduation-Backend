import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";
import { searchDto } from "./dto/search.dto";
import fetch from "node-fetch";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async jobs(req, res, query) {
    if (query.type == "FeaturedJobs") {
      return this.FeaturedJobs(req, res, query);
    } else if (query.type == "RecommendedJobs") {
      return this.RecommendedJobs(req, res, query);
    } else {
      return this.savedJobs(req, res, query);
    }
  }
  async job(req, res, id) {
    const job = await this.prisma.jobs.findUnique({
      where: {
        id,
      },
      include: {
        jobSkills: true,
        jobTitle: true,
        company: true,
      },
    });
    const applayJob = await this.prisma.applayJobs.findFirst({
      where: {
        userId: req.user.userObject.id,
        jobsId: id,
      },
    });
    const numberOfApplicants = await this.prisma.applayJobs.count({
      where: {
        jobsId: id,
      },
    });
    let cities;
    await fetch(
      "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
    )
      .then((response) => response.json())
      .then((data) => (cities = Object.keys(data).map((key) => data[key])));
    var city;
    cities.forEach((element) => {
      if (element["code"] == job.companyLocationId) {
        city = element["name"];
      }
    });
    job["location"] = city;
    if (!job) {
      return ResponseController.badRequest(
        res,
        "Job not found",
        "Job not found"
      );
    }
    return ResponseController.success(res, "Get data Successfully", {
      job,
      applayJob,
      numberOfApplicants,
    });
  } //
  async RecommendedJobs(req, res, query) {
    let Salary;
    if (query.salary) {
      if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] === "3000"
      ) {
        Salary = 3000;
      } else if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] === "6000"
      ) {
        Salary = 6000;
      } else if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] ===
          "9000" &&
        query.salary.split(" ")[0] === "less"
      ) {
        //
        Salary = 9000; ////
      } else {
        //
        Salary = 1000000; //
      }
    }
    const userTitle = await this.prisma.user.findUnique({
      where: {
        id: req.user.userObject.id,
      },
      select: {
        jobId: true,
        cityId: true,

        userSkills: {
          select: {
            id: true,
          },
        },
      },
    });
    const size = await this.prisma.jobs.count({});
    let jobs = await this.prisma.jobs.findMany({
      where: {
        jobTitleId: query.jobTitle ? query.jobTitle : userTitle.jobId,
        jobLocationType: query.wayOfWork || {},
        jobType: query.jobType || {},
        salary: {
          lte: Salary || 100000000,
        },
        companyId: query.company || {},
        location: {
          code: query.jobLocation ? query.jobLocation : userTitle.cityId,
        },
      },

      orderBy: { createdAt: "desc" },
      include: {
        jobTitle: true,
        jobSkills: {
          include: {
            skill: true,
          },
        },
        applayJobs: {
          where: {
            userId: req.user.userObject.id,
          },
        },
        company: true,
        userJobs: true,

        location: true,
      },
    });
    const RecommendedJobs = [];
    for (let i = 0; i < jobs.length; i += 1) {
      let x = 0;
      for (let j = 0; j < jobs[i].jobSkills.length; j += 1) {
        if (userTitle.userSkills.includes(jobs[i].jobSkills[j])) x += 1;
      }
      RecommendedJobs.push({
        ...jobs[i],
        similarity: x,
      });
    }
    RecommendedJobs.sort((a, b) => a.similarity - b.similarity);

    return ResponseController.success(res, "Get Data Successfully", {
      RecommendedJobs,
      size,
    }); //
  }
  async FeaturedJobs(req, res, query) {
    let Salary;
    if (query.salary) {
      if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] === "3000"
      ) {
        Salary = 3000;
      } else if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] === "6000"
      ) {
        Salary = 6000;
      } else if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] ===
          "9000" &&
        query.salary.split(" ")[0] === "less"
      ) {
        //
        Salary = 9000;
      } else {
        Salary = 1000000; //
      }
    }
    console.log(query);
    const FeaturedJobs = await this.prisma.jobs.findMany({
      skip: parseInt(query.skip) || 0,
      take: +query.take || 6,
      where: {
        jobTitleId: query.jobTitle,
        jobLocationType: query.wayOfWork || {},
        jobType: query.jobType || {},
        salary: {
          lte: Salary || 100000000,
        },
        companyId: query.company || {},
        location: {
          code: query.jobLocation || {},
        }, ////
      },
      orderBy: { createdAt: "desc" }, //
      include: {
        jobTitle: true,
        jobSkills: {
          include: {
            skill: true,
          },
        },
        applayJobs: {
          where: {
            userId: req.user.userObject.id,
          },
        },
        company: true,
        userJobs: true,
        location: true,
      }, ////
    });
    const size = await this.prisma.jobs.count({});

    return ResponseController.success(res, "Get Data Successfully", {
      FeaturedJobs,
      size,
    });
  } //

  async savedJobs(req, res, query) {
    let Salary;
    if (query.salary) {
      if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] === "3000"
      ) {
        Salary = 3000;
      } else if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] === "6000"
      ) {
        Salary = 6000;
      } else if (
        query.salary.split(" ")[query.salary.split(" ").length - 1] ===
          "9000" &&
        query.salary.split(" ")[0] === "less"
      ) {
        //
        Salary = 9000;
      } else {
        Salary = 1000000; //
      }
    }
    const savedJobs = await this.prisma.userJobs.findMany({
      where: {
        userId: req.user.userObject.id,
        jobs: {
          jobTitleId: query.jobTitle,
          jobLocationType: query.wayOfWork || {},
          jobType: query.jobType || {},
          salary: {
            lte: Salary || 100000000,
          },
          companyId: query.company || {},
          location: {
            code: query.jobLocation || {}, //
          },
        },
      },

      include: {
        jobs: {
          include: {
            jobSkills: {
              include: {
                skill: true,
              },
            },
            applayJobs: {
              where: {
                userId: req.user.userObject.id,
              },
            },
            company: true,
            location: true,
            jobTitle: true,
          },
        },
      }, ////
    });
    const size = await this.prisma.userJobs.count({
      where: {
        userId: req.user.userObject.id,
      },
    });
    return ResponseController.success(res, "Get Data Successfully", {
      savedJobs,
      size,
    });
  }

  async bookmark(req, res, id) {
    const job = await this.prisma.jobs.findUnique({
      where: {
        id,
      },
      select: {
        jobSkills: true,
      },
    });
    if (!job) {
      return ResponseController.badRequest(
        res,
        "Job not found",
        "Job not found"
      );
    }
    const exist = await this.prisma.userJobs.findFirst({
      where: {
        userId: req.user.userObject.id,
        jobsId: id,
      },
    });
    if (!exist) {
      await this.prisma.userJobs.create({
        data: {
          jobsId: id,
          userId: req.user.userObject.id,
        },
      });
      return ResponseController.success(res, "job not marked", null);
    } else {
      await this.prisma.userJobs.delete({
        where: {
          id: exist.id,
        },
      });
      return ResponseController.success(res, "job marked", null);
    }
  }
  async applay(req, res, id) {
    const exist = await this.prisma.jobs.findUnique({
      where: {
        id,
      },
      select: {
        applayJobs: true,
      },
    });
    if (exist.applayJobs) {
      return ResponseController.conflict(
        res,
        "You applayed for this job before"
      );
    }
    if (!exist) {
      return ResponseController.badRequest(
        res,
        "Job not found",
        "Job not found"
      );
    }
    await this.prisma.applayJobs.create({
      data: {
        userId: req.user.userObject.id,
        jobsId: id,
      },
    });
    return ResponseController.success(res, "Applay for Job Successfully");
  }
  async addJob(req, res, addJobDto) {
    const {
      jobType,
      jobLocationType,
      salary,
      salaryPer,
      jobLocationId,
      jobSkillId,
      jobTitleId,
      jobDescription,
    } = addJobDto;
    const job = await this.prisma.jobs.create({
      data: {
        jobType,
        jobLocationType,
        salary,
        salaryPer,
        companyLocationId: jobLocationId,
        companyId: req.user.userObject.id,
        jobTitleId,
        jobDescription,
      },
    });
    for (let i = 0; i < jobSkillId.length; i += 1) {
      await this.prisma.jobSkills.create({
        data: {
          jobId: job.id,
          skillId: jobSkillId[i],
        },
      });
    }

    return ResponseController.success(res, "add Data Successfully", null);
  }

  async search(req, res, searchDto) {
    const { searchData } = searchDto;
    console.log(searchData);
    const jobs = await this.prisma.jobs.findMany({
      where: {
        OR: [
          {
            jobTitle: {
              title: {
                startsWith: searchData,
              },
            },
          },
        ],
      },
      take: 3,
      include: {
        jobTitle: true,
        jobSkills: {
          include: {
            skill: true,
          },
        },
        applayJobs: {
          where: {
            userId: req.user.userObject.id,
          },
        },
        company: true,
        userJobs: true,
        location: true,
      },
    });
    return ResponseController.success(res, "Get data successfully", jobs);
  }
  async meetUser(req, res, meetingDto) {
    const { userId, date, time } = meetingDto;
    const meet = await this.prisma.meetings.create({
      data: {
        companyId: req.user.userObject.id,
        userId,
        date,
        time,
        description: "",
      },
      include: {
        User: true,
      },
    });
    await this.mail.sendMeet(
      meet.User.name,

      meet.User.email,
      req.user.userObject.id,
      date,
      time
    );
    await this.prisma.notification.create({
      data: {
        userId,
        companyId: req.user.userObject.id,
        description: `${req.user.userJobs.name} want to meet you check your mail for more details`,
      },
    });

    return ResponseController.created(res, "meeting create Successdully", null);
  }
  async deleteApplay(req, res, id, userId) {
    const job = await this.prisma.applayJobs.findFirst({
      where: {
        jobsId: id,
        userId,
      },
    });
    await this.prisma.applayJobs.delete({
      where: {
        id: job.id,
      },
    });
    return ResponseController.success(res, "delete data successfully", null);
  }
  async deleteJob(req, res, id) {
    await this.prisma.jobs.delete({
      where: {
        id,
      },
    });
    return ResponseController.success(res, "delete Data Successfully", null);
  }
}
