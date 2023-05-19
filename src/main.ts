import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';

import { AppModule } from './modules/app/app.module';
import { API_PREFIX } from './shared/constants/global.constants';
import { MyLogger } from './logger/logger.service';
import { InvalidFormExceptionFilter } from './filters/invalid.form.exception.filter';
import { CorsConfig, NestConfig } from './configs/config.interface';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'error', 'warn'],
  });

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(new InvalidFormExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  if (corsConfig.enabled) {
    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
      }),
    );
    app.enableCors();
  }

  const PORT = process.env.PORT || nestConfig.port;
  await app.listen(PORT, async () => {
    const myLogger = await app.resolve(MyLogger);
    myLogger.log(`Server started listening: ${PORT}`);
  });
}
bootstrap();
