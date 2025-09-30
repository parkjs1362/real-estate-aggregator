import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SearchComplexDto, GetComplexesDto } from './dto/complex.dto';

@Injectable()
export class ComplexService {
  constructor(private prisma: PrismaService) {}

  /**
   * 단지 검색 (자동완성용)
   */
  async searchComplexes(query: SearchComplexDto) {
    const { q, limit = 10, region } = query;

    const whereClause: any = {};

    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { roadAddress: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (region) {
      whereClause.OR = [
        { sidoCode: region },
        { gugunCode: region },
      ];
    }

    const complexes = await this.prisma.complex.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        address: true,
        roadAddress: true,
        sidoName: true,
        gugunName: true,
        dongName: true,
        buildYear: true,
        totalCount: true,
      },
      take: limit,
      orderBy: [
        { name: 'asc' },
        { address: 'asc' },
      ],
    });

    return {
      data: complexes,
      total: complexes.length,
    };
  }

  /**
   * 단지 목록 조회 (페이지네이션)
   */
  async getComplexes(query: GetComplexesDto) {
    const {
      page = 1,
      limit = 20,
      sido,
      gugun,
      dong,
      buildYearMin,
      buildYearMax,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const skip = (page - 1) * limit;
    const whereClause: any = {};

    // 필터 조건
    if (sido) whereClause.sidoCode = sido;
    if (gugun) whereClause.gugunCode = gugun;
    if (dong) whereClause.dongCode = dong;

    if (buildYearMin || buildYearMax) {
      whereClause.buildYear = {};
      if (buildYearMin) whereClause.buildYear.gte = buildYearMin;
      if (buildYearMax) whereClause.buildYear.lte = buildYearMax;
    }

    // 정렬 조건
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [complexes, total] = await Promise.all([
      this.prisma.complex.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              unitTypes: true,
              deals: true,
              listings: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.complex.count({ where: whereClause }),
    ]);

    return {
      data: complexes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 단지 상세 정보
   */
  async getComplexById(id: string) {
    const complex = await this.prisma.complex.findUnique({
      where: { id },
      include: {
        unitTypes: {
          orderBy: { exclusiveArea: 'asc' },
        },
        _count: {
          select: {
            deals: true,
            listings: true,
            favorites: true,
          },
        },
      },
    });

    if (!complex) {
      throw new NotFoundException('단지를 찾을 수 없습니다.');
    }

    return complex;
  }

  /**
   * 단지의 타입별 정보
   */
  async getComplexTypes(complexId: string) {
    // 단지 존재 여부 확인
    const complex = await this.prisma.complex.findUnique({
      where: { id: complexId },
      select: { id: true, name: true },
    });

    if (!complex) {
      throw new NotFoundException('단지를 찾을 수 없습니다.');
    }

    const unitTypes = await this.prisma.unitType.findMany({
      where: { complexId },
      include: {
        _count: {
          select: {
            deals: true,
            listings: true,
          },
        },
      },
      orderBy: { exclusiveArea: 'asc' },
    });

    return {
      complex,
      unitTypes,
    };
  }

  /**
   * 단지 요약 정보 (최근 시세 포함)
   */
  async getComplexSummary(complexId: string) {
    const complex = await this.prisma.complex.findUnique({
      where: { id: complexId },
      include: {
        unitTypes: {
          select: {
            id: true,
            exclusiveArea: true,
            pyeongDisplay: true,
          },
          orderBy: { exclusiveArea: 'asc' },
        },
      },
    });

    if (!complex) {
      throw new NotFoundException('단지를 찾을 수 없습니다.');
    }

    // 최근 30일 가격 스냅샷
    const recentSnapshots = await this.prisma.priceSnapshot.findMany({
      where: {
        complexId,
        snapshotDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        unitType: {
          select: {
            exclusiveArea: true,
            pyeongDisplay: true,
          },
        },
      },
      orderBy: [
        { snapshotDate: 'desc' },
        { unitType: { exclusiveArea: 'asc' } },
      ],
    });

    // 현재 매물 수
    const currentListings = await this.prisma.listing.count({
      where: {
        complexId,
        status: 'ACTIVE',
      },
    });

    return {
      complex,
      recentPrices: recentSnapshots,
      currentListings,
    };
  }

  /**
   * 단지 통계 정보
   */
  async getComplexStatistics(complexId: string) {
    const complex = await this.prisma.complex.findUnique({
      where: { id: complexId },
      select: { id: true, name: true },
    });

    if (!complex) {
      throw new NotFoundException('단지를 찾을 수 없습니다.');
    }

    // 통계 데이터 병렬 조회
    const [
      dealStats,
      listingStats,
      priceHistory,
      monthlyTrend,
    ] = await Promise.all([
      // 실거래 통계
      this.prisma.deal.groupBy({
        by: ['dealType'],
        where: { complexId },
        _count: { id: true },
        _avg: { dealAmount: true },
        _min: { dealAmount: true },
        _max: { dealAmount: true },
      }),

      // 매물 통계
      this.prisma.listing.groupBy({
        by: ['listingType', 'status'],
        where: { complexId },
        _count: { id: true },
        _avg: { price: true },
      }),

      // 최근 6개월 가격 히스토리
      this.prisma.priceSnapshot.findMany({
        where: {
          complexId,
          snapshotDate: {
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { snapshotDate: 'asc' },
      }),

      // 월별 거래 트렌드
      this.prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', "dealDate") as month,
          "dealType",
          COUNT(*) as count,
          AVG("dealAmount") as avgPrice
        FROM "deals"
        WHERE "complexId" = ${complexId}
          AND "dealDate" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "dealDate"), "dealType"
        ORDER BY month DESC
      `,
    ]);

    return {
      complex,
      dealStats,
      listingStats,
      priceHistory,
      monthlyTrend,
    };
  }
}