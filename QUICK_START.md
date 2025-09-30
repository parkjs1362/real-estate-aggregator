# 🚀 빠른 시작 가이드

## GitHub에 업로드하기

### 1. GitHub 리포지토리 생성

1. GitHub (https://github.com) 에 로그인
2. 우측 상단 '+' 버튼 클릭 → 'New repository' 선택
3. Repository 정보 입력:
   - Repository name: `real-estate-aggregator`
   - Description: `한국 부동산 데이터 집계 플랫폼 - 실거래가와 매물 정보를 한 곳에서`
   - Public 선택
   - **"Initialize this repository with a README" 체크하지 않기** (이미 로컬에 파일이 있음)
4. 'Create repository' 클릭

### 2. 로컬 프로젝트를 GitHub에 푸시

생성된 리포지토리 페이지에서 안내하는 명령어를 실행:

```bash
cd real-estate-aggregator

# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/real-estate-aggregator.git

# 기본 브랜치 이름 설정 (main)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

> ⚠️ **주의**: `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경하세요!

### 3. 프로젝트 확인

GitHub 리포지토리 페이지를 새로고침하면 모든 파일이 업로드된 것을 확인할 수 있습니다.

---

## 로컬 개발 환경 설정

### 1. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집하여 필요한 값 입력
# - GOV_API_KEY: 국토교통부 API 키 (https://data.go.kr)
# - DATABASE_URL: PostgreSQL 연결 문자열
# - JWT_SECRET: JWT 암호화 키
```

### 2. Docker로 개발 환경 실행

```bash
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

### 3. 수동으로 개발 환경 실행

```bash
# 1. 의존성 설치
npm install

# 2. PostgreSQL과 Redis 시작 (Docker 또는 로컬)
# PostgreSQL: 5432 포트
# Redis: 6379 포트

# 3. Prisma 마이그레이션
npx prisma migrate dev --schema=packages/database/schema.prisma

# 4. 시드 데이터 생성
npx tsx packages/database/seed.ts

# 5. 개발 서버 시작 (모든 서비스)
npm run dev
```

### 4. 접속

- **프론트엔드**: http://localhost:3001
- **백엔드 API**: http://localhost:3000
- **API 문서**: http://localhost:3000/api/docs
- **데이터베이스 관리**: http://localhost:8080 (Adminer)

---

## 유용한 명령어

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# Prisma Studio (데이터베이스 GUI)
npm run db:studio

# Docker Compose 관련
docker-compose up -d          # 모든 서비스 시작
docker-compose down           # 모든 서비스 중지
docker-compose logs -f app    # 로그 확인
docker-compose restart app    # 서비스 재시작
```

---

## 문제 해결

### Docker 관련 오류

```bash
# Docker 캐시 삭제 및 재빌드
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### 데이터베이스 연결 오류

```bash
# 데이터베이스 연결 확인
docker-compose exec database psql -U postgres -d realestate -c "SELECT 1"

# 데이터베이스 재생성
docker-compose down -v
docker-compose up -d database
npm run db:migrate
```

### 포트 충돌

`.env` 파일에서 포트 변경:
```env
API_PORT=3000
WEB_PORT=3001
DATABASE_PORT=5432
REDIS_PORT=6379
```

---

## 다음 단계

1. ✅ GitHub 리포지토리 생성 완료
2. ✅ 로컬 개발 환경 설정 완료
3. 🔧 국토교통부 API 키 발급 (https://data.go.kr)
4. 🔧 환경 변수 설정 (.env)
5. 🚀 개발 시작!

## 도움이 필요하신가요?

- 📖 전체 문서: [README.md](README.md)
- 🐛 이슈 등록: GitHub Issues
- 💬 토론: GitHub Discussions

Happy Coding! 🎉