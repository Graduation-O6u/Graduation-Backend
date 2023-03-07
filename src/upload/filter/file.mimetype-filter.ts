import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";

export function fileMimetypeFilter(...mimetypes: string[]) {
  return (
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void
  ) => {
    console.log(file);
    if (
      file.originalname.split(".")[file.originalname.split(".").length - 1] ==
      "pdf"
    ) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          `File type is not matching: ${mimetypes.join(", ")}`
        ),
        false
      );
    }
  };
}
