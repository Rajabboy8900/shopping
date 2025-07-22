import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parserni middleware sifatida ulash
  app.use(cookieParser());

  // Swagger konfiguratsiyasi
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-Store API Docs')
    .setDescription('Elektron do‘kon uchun backend hujjatlari')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDoc);

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);

  console.log(`🚀 Server ishga tushdi: http://localhost:${port}`);
  console.log(`📘 Swagger hujjatlar: http://localhost:${port}/api`);
}

bootstrap();
