import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { tokenService } from "./token.service";
import { jwtStrategy, refreshJwtStrategy } from "./stratiges/jwt.stratigy";
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: 1 * 24 * 60 * 60 },
    }),
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
