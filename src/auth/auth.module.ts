import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma.service";
import { tokenService } from "./token.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, tokenService],
})
export class AuthModule {}
