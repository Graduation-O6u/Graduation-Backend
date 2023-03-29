import { NestFactory } from "@nestjs/core";
import { SwaggerInit } from "./API/SwaggerConfig";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma.service";
import { HttpExceptionFilter } from "./util/http-exception.filter";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.setGlobalPrefix("/");
  if (process.env.NODE_ENV === "development") {
    app.enableCors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "*",
    });
  }
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutDownHooks(app);
  SwaggerInit.init(app);
  await app.listen(await app.getUrl());
  const url = await await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`Swagger Docomentation On: ${await app.getUrl()}/api/v1/docs`);
}

bootstrap();
