import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@real-estate/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.DATABASE_LOGGING === 'true' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ 데이터베이스 연결 성공');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 데이터베이스 연결 종료');
  }

  /**
   * 헬스체크용 연결 테스트
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('데이터베이스 헬스체크 실패:', error);
      return false;
    }
  }
}