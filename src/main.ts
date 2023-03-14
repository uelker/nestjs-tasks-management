import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appPrefix = 'tasks-management-service';
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(appPrefix);

  const config = new DocumentBuilder()
    .setTitle('Tasks-Management-Service')
    .setDescription('The Tasks Management Service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${appPrefix}/api`, app, document);

  await app.listen(3000);
}
bootstrap();
