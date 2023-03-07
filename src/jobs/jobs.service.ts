import { Injectable } from "@nestjs/common";
import { jobLocationType, jobType } from "@prisma/client";
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
      return this.savedJobs(res, query);
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
  }
  async RecommendedJobs(req, res, query) {
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
    let jobs = await this.prisma.jobs.findMany({
      where: {
        jobTitleId: query.jobTitle ? query.jobTitle : userTitle.jobId,
        jobLocationType: query.wayOfWork
          ? query.wayOfWork
          : jobLocationType.Hybrid ||
            jobLocationType.On_Site ||
            jobLocationType.Remote,
        jobType: query.jobType
          ? query.jobType
          : jobType.Full_Time || jobType.Part_Time || jobType.Internship,
        salary: query.salary || {},
        company: query.company || {},
        location: {
          code: query.jobLocation ? query.jobLocation : userTitle.cityId,
        },
      },
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 6) || 0,
      take: +query.take || 6,
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        company: true,
        salary: true,
        userJobs: true,
        jobSkills: {
          select: {
            id: true,
          },
        },
      },
    });
    const RecommendedJobs = [];
    for (let i = 0; i < jobs.length; i += 1) {
      let x = 0;
      for (let j = 0; j < jobs[i].jobSkills.length; j += 1) {
        if (userTitle.userSkills.includes(jobs[i].jobSkills[j])) x += 1;
      }
      RecommendedJobs.push({
        ...RecommendedJobs,
        similarity: x,
      });
    }
    return ResponseController.success(
      res,
      "Get Data Successfully",
      RecommendedJobs
    ); //
  }
  async FeaturedJobs(res, query) {
    console.log("hererer");
    const FeaturedJobs = await this.prisma.jobs.findMany({
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 6) || 0,
      take: +query.take || 6,
      where: {
        jobTitleId: query.jobTitle,
        jobLocationType: query.wayOfWork
          ? query.wayOfWork
          : jobLocationType.Hybrid ||
            jobLocationType.On_Site ||
            jobLocationType.Remote,
        jobType: query.jobType
          ? query.jobType
          : jobType.Full_Time || jobType.Part_Time || jobType.Internship,
        salary: query.salary || {},
        company: query.company || {},
        location: {
          code: query.jobLocation || {},
        }, ////
      },
      orderBy: { createdAt: "desc" }, //
      include: {
        company: true,
        userJobs: true,
      }, ////
    });
    return ResponseController.success(
      res,
      "Get Data Successfully",
      FeaturedJobs
    );
  } //

  async savedJobs(res, query) {
    const savedJobs = await this.prisma.userJobs.findMany({
      where: {
        jobs: {
          jobTitleId: query.jobTitle,
          jobLocationType: query.wayOfWork
            ? query.wayOfWork
            : jobLocationType.Hybrid ||
              jobLocationType.On_Site ||
              jobLocationType.Remote,
          jobType: query.jobType
            ? query.jobType
            : jobType.Full_Time || jobType.Part_Time || jobType.Internship,
          salary: query.salary || {},
          company: query.company || {},
          location: {
            code: query.jobLocation || {},
          },
        },
      },
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 6) || 0,
      take: +query.take || 6,
      select: {
        jobs: true,
      }, //
    });
    return ResponseController.success(res, "Get Data Successfully", savedJobs);
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
