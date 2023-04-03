import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async jobs(req, res, query) {
    if (query.type == "FeaturedJobs") {
      return this.FeaturedJobs(res, query);
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
    return ResponseController.success(res, "Get data Successfully", job);
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
        company: true,
        userJobs: true,
        jobSkills: true,
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
  async FeaturedJobs(res, query) {
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

      select: {
        jobs: true,
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
}
