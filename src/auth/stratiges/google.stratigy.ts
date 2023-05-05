import { PassportStrategy } from "@nestjs/passport";
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from "@nestjs/common";
import { Strategy, Profile } from "passport-google-oauth20";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://jobb-45md.onrender.com/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done
  ): Promise<any> {
    const { id, name, emails } = profile;
    const { picture } = profile._json;
    const user = {
      id: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: picture,
      accessToken,
    };
    done(null, user);
  }
}
