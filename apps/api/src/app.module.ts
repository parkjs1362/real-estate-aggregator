import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

// 모듈
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ComplexModule } from './modules/complex/complex.module';
import { DealModule } from './modules/deal/deal.module';
import { ListingModule } from './modules/listing/listing.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { AlertModule } from './modules/alert/alert.module';
import { SearchModule } from './modules/search/search.module';
import { JobModule } from './jobs/job.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // 환경 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15분
        limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100회
      },
    ]),

    // Redis 캐시
    CacheModule.register({
      isGlobal: true,
      store: 'redis',
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      ttl: 300, // 5분 기본 TTL
    }),

    // BullMQ 작업 큐
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // 핵심 모듈
    DatabaseModule,
    AuthModule,
    ComplexModule,
    DealModule,
    ListingModule,
    FavoriteModule,
    AlertModule,
    SearchModule,
    JobModule,
    HealthModule,
  ],
  providers: [
    // 글로벌 가드
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // JWT 인증은 컨트롤러별로 적용
  ],
})
export class AppModule {}