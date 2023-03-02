import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { tokenService } from "./token.service";
import { jwtStrategy, refreshJwtStrategy } from "./stratiges/jwt.stratigy";
import { MailModule } from "src/mail/mail.module";
import { MulterModule } from "@nestjs/platform-express";
@Module({
  imports: [
    MulterModule.register({
      dest: "../../uploads",
    }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: 1 * 24 * 60 * 60 },
    }),
    MailModule,
  ],
  exports: [AuthService, tokenService],
  providers: [
    AuthService,
    PrismaService,
    tokenService,
    jwtStrategy,
    refreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
