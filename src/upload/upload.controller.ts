import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Observable, of } from "rxjs";
import { ApiAssetFile } from "./decorator/api-file.decorator";
import { ParseFile } from "./pipes/parse-file.pip";

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  @ApiBearerAuth("Access Token")
  @Post("file")
  @ApiAssetFile("file", true)
  uploadFile(@UploadedFile(ParseFile) file): Observable<{ url: string }> {
    console.log("hi");
    return of({
      url: `${process.env.BASE_URL}/api/v1/${file.path
        .replace("uploads\\", "")
        .replace("\\", "/")}`,
    });
  }
}
