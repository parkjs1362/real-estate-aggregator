import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001'],
    credentials: true,
  });

  // 글로벌 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API 문서 설정
  const config = new DocumentBuilder()
    .setTitle('부동산 데이터 집계 API')
    .setDescription('실거래가와 매물 정보를 제공하는 RESTful API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '인증')
    .addTag('complex', '단지')
    .addTag('deals', '실거래')
    .addTag('listings', '매물')
    .addTag('favorites', '즐겨찾기')
    .addTag('alerts', '알림')
    .addTag('search', '검색')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API 서버가 http://localhost:${port} 에서 실행중입니다`);
  console.log(`📚 API 문서: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ 서버 시작 실패:', error);
  process.exit(1);
});