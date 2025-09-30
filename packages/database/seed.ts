import { PrismaClient, SourceType, DealType, ListingType, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  // 데이터 소스 생성
  console.log('📡 데이터 소스 설정...');
  const govSource = await prisma.dataSource.upsert({
    where: { id: 'gov-api' },
    update: {},
    create: {
      id: 'gov-api',
      sourceType: SourceType.GOVERNMENT,
      name: '국토교통부 실거래가 API',
      url: 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc',
      isActive: true,
      rateLimit: 10,
    },
  });

  // 샘플 아파트 단지 생성
  console.log('🏢 샘플 단지 데이터 생성...');

  const complexes = [
    {
      id: 'complex-1',
      complexCode: '11110-101',
      name: '래미안 강남 포레스트',
      address: '서울특별시 강남구 역삼동 123-45',
      roadAddress: '서울특별시 강남구 테헤란로 123',
      sidoCode: '11',
      sidoName: '서울특별시',
      gugunCode: '11110',
      gugunName: '강남구',
      dongCode: '1111010500',
      dongName: '역삼동',
      buildYear: 2020,
      totalCount: 800,
      floorMax: 25,
      floorMin: 2,
      latitude: 37.5665,
      longitude: 127.0780,
    },
    {
      id: 'complex-2',
      complexCode: '11140-201',
      name: '힐스테이트 서초',
      address: '서울특별시 서초구 서초동 456-78',
      roadAddress: '서울특별시 서초구 서초대로 456',
      sidoCode: '11',
      sidoName: '서울특별시',
      gugunCode: '11140',
      gugunName: '서초구',
      dongCode: '1114010500',
      dongName: '서초동',
      buildYear: 2018,
      totalCount: 600,
      floorMax: 20,
      floorMin: 1,
      latitude: 37.4957,
      longitude: 127.0274,
    },
    {
      id: 'complex-3',
      complexCode: '41135-301',
      name: '철산역자이',
      address: '경기도 광명시 철산동 789-12',
      roadAddress: '경기도 광명시 철산로 789',
      sidoCode: '41',
      sidoName: '경기도',
      gugunCode: '41135',
      gugunName: '광명시',
      dongCode: '4113510100',
      dongName: '철산동',
      buildYear: 2025,
      totalCount: 2045,
      floorMax: 29,
      floorMin: 7,
      latitude: 37.4789,
      longitude: 126.8674,
    },
  ];

  for (const complexData of complexes) {
    await prisma.complex.upsert({
      where: { id: complexData.id },
      update: {},
      create: complexData,
    });
  }

  // 타입별 정보 생성
  console.log('📐 타입별 정보 생성...');

  const unitTypes = [
    // 래미안 강남 포레스트
    { complexId: 'complex-1', exclusiveArea: 59.92, supplyArea: 84.98, roomCount: 3, bathCount: 2, pyeong: 18.1, pyeongDisplay: '18평형' },
    { complexId: 'complex-1', exclusiveArea: 84.96, supplyArea: 119.88, roomCount: 3, bathCount: 2, pyeong: 25.7, pyeongDisplay: '25평형' },

    // 힐스테이트 서초
    { complexId: 'complex-2', exclusiveArea: 49.50, supplyArea: 69.30, roomCount: 2, bathCount: 1, pyeong: 15.0, pyeongDisplay: '15평형' },
    { complexId: 'complex-2', exclusiveArea: 74.25, supplyArea: 103.95, roomCount: 3, bathCount: 2, pyeong: 22.5, pyeongDisplay: '22평형' },

    // 철산역자이
    { complexId: 'complex-3', exclusiveArea: 49.00, supplyArea: 68.60, roomCount: 2, bathCount: 1, pyeong: 14.8, pyeongDisplay: '15평형' },
    { complexId: 'complex-3', exclusiveArea: 59.00, supplyArea: 82.60, roomCount: 3, bathCount: 2, pyeong: 17.8, pyeongDisplay: '18평형' },
    { complexId: 'complex-3', exclusiveArea: 84.00, supplyArea: 117.60, roomCount: 3, bathCount: 2, pyeong: 25.4, pyeongDisplay: '25평형' },
  ];

  for (const unitType of unitTypes) {
    await prisma.unitType.create({
      data: unitType,
    });
  }

  // 샘플 실거래 데이터 생성
  console.log('💰 샘플 실거래 데이터 생성...');

  const deals = [
    {
      complexId: 'complex-1',
      unitTypeId: (await prisma.unitType.findFirst({ where: { complexId: 'complex-1', exclusiveArea: 59.92 } }))!.id,
      dealType: DealType.SALE,
      dealDate: new Date('2024-09-15'),
      dealAmount: BigInt(1250000000), // 12.5억
      dong: '101',
      floor: 15,
      sourceType: SourceType.GOVERNMENT,
    },
    {
      complexId: 'complex-1',
      unitTypeId: (await prisma.unitType.findFirst({ where: { complexId: 'complex-1', exclusiveArea: 84.96 } }))!.id,
      dealType: DealType.SALE,
      dealDate: new Date('2024-09-20'),
      dealAmount: BigInt(1680000000), // 16.8억
      dong: '102',
      floor: 8,
      sourceType: SourceType.GOVERNMENT,
    },
    {
      complexId: 'complex-2',
      unitTypeId: (await prisma.unitType.findFirst({ where: { complexId: 'complex-2', exclusiveArea: 74.25 } }))!.id,
      dealType: DealType.JEONSE,
      dealDate: new Date('2024-09-18'),
      dealAmount: BigInt(0),
      depositAmount: BigInt(800000000), // 8억 전세
      dong: '201',
      floor: 12,
      sourceType: SourceType.GOVERNMENT,
    },
  ];

  for (const deal of deals) {
    await prisma.deal.create({
      data: deal,
    });
  }

  // 샘플 매물 데이터 생성
  console.log('🏠 샘플 매물 데이터 생성...');

  const listings = [
    {
      complexId: 'complex-1',
      unitTypeId: (await prisma.unitType.findFirst({ where: { complexId: 'complex-1', exclusiveArea: 59.92 } }))!.id,
      listingType: ListingType.SALE,
      price: BigInt(1280000000), // 12.8억
      dong: '103',
      floor: 10,
      direction: '남동향',
      status: ListingStatus.ACTIVE,
      agentName: '강남부동산',
      agentPhone: '02-1234-5678',
      registeredAt: new Date('2024-09-25'),
      sourceType: SourceType.NAVER,
      sourceId: 'naver-listing-001',
    },
    {
      complexId: 'complex-2',
      unitTypeId: (await prisma.unitType.findFirst({ where: { complexId: 'complex-2', exclusiveArea: 49.50 } }))!.id,
      listingType: ListingType.MONTHLY,
      price: BigInt(50000000), // 보증금 5천만원
      monthlyRent: 180, // 월세 180만원
      dong: '202',
      floor: 5,
      direction: '남향',
      status: ListingStatus.ACTIVE,
      agentName: '서초중개',
      agentPhone: '02-9876-5432',
      registeredAt: new Date('2024-09-22'),
      sourceType: SourceType.ZIGBANG,
      sourceId: 'zigbang-listing-002',
    },
  ];

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing,
    });
  }

  // 샘플 사용자 생성
  console.log('👤 샘플 사용자 생성...');

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '김부동산',
      password: '$2b$10$hashedpassword', // 실제로는 bcrypt로 해시된 비밀번호
    },
  });

  // 즐겨찾기 생성
  console.log('⭐ 즐겨찾기 데이터 생성...');

  await prisma.favorite.create({
    data: {
      userId: user.id,
      complexId: 'complex-1',
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user.id,
      complexId: 'complex-3',
    },
  });

  console.log('✅ 시드 데이터 생성 완료!');
  console.log(`
📊 생성된 데이터:
- 단지: ${complexes.length}개
- 타입: ${unitTypes.length}개
- 실거래: ${deals.length}건
- 매물: ${listings.length}개
- 사용자: 1명
- 즐겨찾기: 2개
  `);
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });