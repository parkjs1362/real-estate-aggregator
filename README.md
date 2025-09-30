# 🏠 한국 부동산 데이터 집계 플랫폼

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)

실거래가와 현재 매물 정보를 한 곳에서 확인할 수 있는 부동산 데이터 집계 플랫폼입니다.

## ⚠️ 법적 컴플라이언스 경고

**이 프로젝트는 다음 사항을 엄격히 준수합니다:**

- 🏛️ **공공데이터 우선**: 국토교통부 실거래가 공개 API 사용
- 📜 **이용약관 준수**: 모든 제3자 사이트의 robots.txt, 이용약관 엄격 준수
- 🔒 **개인정보보호**: 개인정보 최소 수집 원칙 적용
- 📝 **출처 표기**: 모든 데이터에 출처 및 업데이트 시각 명시
- ⚖️ **저작권 준수**: 각 사이트별 저작권 및 이용 정책 확인 필수

**상업적 이용 시 각 데이터 제공처의 별도 허가가 필요할 수 있습니다.**

## 🚀 주요 기능

- 🔍 **통합 검색**: 단지명, 주소, 지역별 아파트 검색
- 📊 **실거래가 분석**: 국토부 데이터 기반 시세 동향 차트
- 🏠 **매물 정보**: 현재 판매/임대 중인 매물 목록
- ⭐ **즐겨찾기**: 관심 단지 저장 및 가격 변동 알림
- 📱 **반응형 UI**: 모바일/데스크톱 최적화 인터페이스
- 🔐 **보안**: JWT 인증, Rate Limiting, CORS 정책

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Next.js 14    │────│   NestJS        │────│   PostgreSQL    │
│   App Router    │    │   + BullMQ      │    │   + Redis       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│  Data Pipeline  │──────────────┘
                        │  정부API + 어댑터 │
                        └─────────────────┘
```

## 📁 프로젝트 구조

```
real-estate-aggregator/
├── apps/
│   ├── web/                    # Next.js 프론트엔드
│   │   ├── app/
│   │   │   ├── page.tsx       # 홈페이지
│   │   │   ├── search/        # 검색 페이지
│   │   │   ├── complex/       # 단지 상세
│   │   │   └── favorites/     # 즐겨찾기
│   │   └── components/        # 재사용 컴포넌트
│   └── api/                   # NestJS 백엔드
│       ├── src/
│       │   ├── modules/       # 도메인별 모듈
│       │   ├── jobs/          # 데이터 수집 작업
│       │   └── shared/        # 공통 서비스
├── packages/
│   ├── database/              # Prisma 스키마
│   ├── collectors/            # 데이터 수집기
│   └── shared/               # 공통 타입/유틸
├── docker-compose.yml         # 개발환경 구성
├── .github/workflows/         # CI/CD 파이프라인
└── scripts/                  # 설치/배포 스크립트
```

## 🛠️ 기술 스택

### Frontend
- **Next.js 14**: App Router, Server Actions, SSR
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **Recharts**: 데이터 시각화

### Backend
- **NestJS**: 모듈형 Node.js 프레임워크
- **Prisma**: 타입 안전 ORM
- **BullMQ**: Redis 기반 작업 큐
- **Zod**: 런타임 데이터 검증

### Database & Infrastructure
- **PostgreSQL**: 주 데이터베이스
- **Redis**: 캐시 & 작업 큐
- **Docker**: 컨테이너화
- **GitHub Actions**: CI/CD

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/real-estate-aggregator.git
cd real-estate-aggregator
```

### 2. 환경 설정

```bash
# 설치 스크립트 실행
chmod +x scripts/setup.sh
./scripts/setup.sh

# 환경 변수 설정
cp .env.example .env
```

### 3. 환경 변수 구성

`.env` 파일에서 다음 값들을 설정하세요:

```env
# 데이터베이스
DATABASE_URL="postgresql://postgres:password@localhost:5432/realestate"
REDIS_URL="redis://localhost:6379"

# 정부 API
GOV_API_KEY="your_government_api_key"
GOV_API_URL="http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc"

# JWT 시크릿
JWT_SECRET="your_super_secret_jwt_key"

# 외부 사이트 (법적 허용 시에만)
NAVER_API_ENABLED=false
HOGANGNO_API_ENABLED=false
```

### 4. Docker Compose 실행

```bash
# 개발 환경 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 5. 애플리케이션 접속

- **프론트엔드**: http://localhost:3001
- **백엔드 API**: http://localhost:3000
- **API 문서**: http://localhost:3000/api/docs

## 📊 데이터 소스

### 공공 데이터 (1순위)
- 🏛️ **국토교통부 실거래가 공개 API**: 아파트 매매/전세 실거래 정보
- 📋 **부동산원 API**: 시세 정보 (제공 시)

### 제3자 사이트 (법적 허용 시에만)
- 🌐 **네이버 부동산**: 현재 매물 정보
- 📈 **호갱노노**: 시세 분석 데이터
- 🏠 **아실**: 매물 상세 정보

> ⚠️ **중요**: 제3자 사이트 연동은 각 사이트의 이용약관, robots.txt, API 정책을 엄격히 준수해야 합니다.

## 🔧 개발 가이드

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

### 테스트 실행

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 커버리지 리포트
npm run test:cov
```

### 코드 품질

```bash
# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 포맷팅
npm run format
```

## 📈 모니터링 & 로깅

### 헬스체크

```bash
# API 서버 상태 확인
curl http://localhost:3000/health

# 데이터베이스 연결 확인
curl http://localhost:3000/health/db
```

### 로그 확인

```bash
# 애플리케이션 로그
docker-compose logs app

# 데이터 수집 작업 로그
docker-compose logs worker
```

## 🚀 배포

### Production 환경

```bash
# Production 이미지 빌드
docker-compose -f docker-compose.prod.yml build

# Production 환경 실행
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD

GitHub Actions를 통한 자동 배포:

1. `main` 브랜치에 푸시
2. 자동 테스트 실행
3. Docker 이미지 빌드
4. 스테이징 환경 배포
5. 승인 후 프로덕션 배포

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## ⚖️ 법적 고지사항

본 프로젝트는 교육 및 연구 목적으로 제작되었습니다. 상업적 이용 시:

1. 각 데이터 제공처의 이용약관을 반드시 확인하세요
2. 필요시 별도의 API 이용 계약을 체결하세요
3. 개인정보보호법 및 관련 법령을 준수하세요
4. 로봇배제표준(robots.txt)을 존중하세요

**이 프로젝트의 사용으로 인한 법적 문제에 대해서는 사용자가 전적으로 책임집니다.**

## 📞 지원

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/real-estate-aggregator/issues)
- 📖 Wiki: [프로젝트 위키](https://github.com/your-username/real-estate-aggregator/wiki)

---

**Made with ❤️ for Korean Real Estate Market**