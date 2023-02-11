import { Injectable } from "@nestjs/common";
import { TokenType, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class tokenService {
  constructor(private prisma: PrismaService) {}
  async createAccess(user: User, refreshId: string) {
    const tokenId = await this.prisma.token.create({
      data: {
        userId: user.id,
        type: TokenType.AccessToken,
        refreshId,
      },
    });
    const accessToken = jwt.sign(
      { userId: user.id, id: tokenId.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 1 * 24 * 60 * 60 }
    );
    return accessToken;
  }
  async createRefresh(user: User, valid: boolean) {
    const tokenId = await this.prisma.token.create({
      data: {
        userId: user.id,
        type: TokenType.RefreshToken,
      },
    });
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        id: tokenId,
        role: user.role,
        type: TokenType.RefreshToken,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: valid ? 30 : 1 * 24 * 60 * 60 }
    );
    return { refreshToken, refreshId: tokenId.id };
  }
}
