import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ComplexService } from './complex.service';
import { SearchComplexDto, GetComplexesDto } from './dto/complex.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('complex')
@Controller('api/complex')
@UseInterceptors(CacheInterceptor)
export class ComplexController {
  constructor(private readonly complexService: ComplexService) {}

  @Get('search')
  @ApiOperation({ summary: '단지 검색 (자동완성)' })
  @ApiResponse({ status: 200, description: '검색 결과 반환' })
  @CacheTTL(300) // 5분 캐시
  async searchComplexes(@Query() query: SearchComplexDto) {
    return this.complexService.searchComplexes(query);
  }

  @Get()
  @ApiOperation({ summary: '단지 목록 조회' })
  @ApiResponse({ status: 200, description: '단지 목록 반환' })
  @CacheTTL(600) // 10분 캐시
  async getComplexes(@Query() query: GetComplexesDto) {
    return this.complexService.getComplexes(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '단지 상세 정보' })
  @ApiResponse({ status: 200, description: '단지 상세 정보 반환' })
  @ApiResponse({ status: 404, description: '단지를 찾을 수 없음' })
  @CacheTTL(300) // 5분 캐시
  async getComplexById(@Param('id') id: string) {
    return this.complexService.getComplexById(id);
  }

  @Get(':id/types')
  @ApiOperation({ summary: '단지의 타입별 정보' })
  @ApiResponse({ status: 200, description: '타입별 정보 반환' })
  @CacheTTL(600) // 10분 캐시
  async getComplexTypes(@Param('id') complexId: string) {
    return this.complexService.getComplexTypes(complexId);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: '단지 요약 정보 (최근 시세 포함)' })
  @ApiResponse({ status: 200, description: '요약 정보 반환' })
  @CacheTTL(300) // 5분 캐시
  async getComplexSummary(@Param('id') complexId: string) {
    return this.complexService.getComplexSummary(complexId);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: '단지 통계 정보' })
  @ApiResponse({ status: 200, description: '통계 정보 반환' })
  @UseGuards(JwtAuthGuard) // 인증 필요
  @ApiBearerAuth()
  @CacheTTL(1800) // 30분 캐시
  async getComplexStatistics(@Param('id') complexId: string) {
    return this.complexService.getComplexStatistics(complexId);
  }
}