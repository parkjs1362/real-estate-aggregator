#!/bin/bash

# ==================================================
# 한국 부동산 데이터 집계 플랫폼 - 설치 스크립트
# 개발 환경 자동 설정
# ==================================================

set -e  # 에러 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 헤더 출력
echo -e "${BLUE}"
echo "=================================================="
echo "🏠 한국 부동산 데이터 집계 플랫폼"
echo "   개발 환경 설정 스크립트"
echo "=================================================="
echo -e "${NC}"

# 시스템 요구사항 확인
log_info "시스템 요구사항 확인 중..."

# Node.js 버전 확인
if ! command -v node &> /dev/null; then
    log_error "Node.js가 설치되지 않았습니다. Node.js 18.0.0 이상을 설치해주세요."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    log_error "Node.js 버전이 $REQUIRED_VERSION 이상이어야 합니다. 현재 버전: $NODE_VERSION"
    exit 1
fi

log_success "Node.js 버전 확인 완료: $NODE_VERSION"

# npm 버전 확인
if ! command -v npm &> /dev/null; then
    log_error "npm이 설치되지 않았습니다."
    exit 1
fi

log_success "npm 확인 완료: $(npm --version)"

# Docker 확인
if ! command -v docker &> /dev/null; then
    log_warning "Docker가 설치되지 않았습니다. Docker를 설치하면 개발 환경을 더 쉽게 구성할 수 있습니다."
else
    log_success "Docker 확인 완료: $(docker --version)"
fi

# Docker Compose 확인
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_warning "Docker Compose가 설치되지 않았습니다."
else
    log_success "Docker Compose 확인 완료"
fi

# 환경 변수 파일 설정
log_info "환경 변수 파일 설정 중..."

if [ ! -f .env ]; then
    log_info ".env 파일을 생성합니다..."
    cp .env.example .env
    log_success ".env 파일이 생성되었습니다. 필요한 값들을 설정해주세요."
else
    log_info ".env 파일이 이미 존재합니다."
fi

# 의존성 설치
log_info "프로젝트 의존성을 설치합니다..."

# 루트 의존성 설치
npm install

# Turbo 설치 (글로벌)
if ! command -v turbo &> /dev/null; then
    log_info "Turbo를 글로벌로 설치합니다..."
    npm install -g turbo
fi

log_success "의존성 설치 완료"

# Prisma 설정
log_info "Prisma 설정 중..."

# Prisma 클라이언트 생성
npx prisma generate --schema=packages/database/schema.prisma

log_success "Prisma 클라이언트 생성 완료"

# Git 훅 설정
log_info "Git 훅을 설정합니다..."

if [ -d .git ]; then
    # Husky 설치 (있는 경우)
    if [ -f .husky ]; then
        npx husky install
        log_success "Husky Git 훅 설정 완료"
    fi
else
    log_warning "Git 저장소가 아닙니다. Git 훅을 설정하지 않습니다."
fi

# Docker 환경 확인 및 설정
if command -v docker &> /dev/null; then
    log_info "Docker 환경을 확인합니다..."

    # Docker 네트워크 생성
    if ! docker network ls | grep -q "realestate-network"; then
        docker network create realestate-network
        log_success "Docker 네트워크 생성 완료"
    fi

    # Docker 볼륨 확인
    if ! docker volume ls | grep -q "realestate_postgres_data"; then
        docker volume create realestate_postgres_data
        log_success "PostgreSQL 볼륨 생성 완료"
    fi

    if ! docker volume ls | grep -q "realestate_redis_data"; then
        docker volume create realestate_redis_data
        log_success "Redis 볼륨 생성 완료"
    fi
fi

# 개발 도구 설정
log_info "개발 도구를 설정합니다..."

# VSCode 설정 확인
if [ -d .vscode ]; then
    log_success "VSCode 설정이 이미 존재합니다."
else
    mkdir -p .vscode

    # VSCode 설정 파일 생성
    cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true
  }
}
EOF

    # 추천 확장 프로그램 설정
    cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
EOF

    log_success "VSCode 설정 파일 생성 완료"
fi

# 건강성 검사
log_info "설치 상태를 확인합니다..."

# 패키지 빌드 테스트
if npm run type-check; then
    log_success "TypeScript 컴파일 확인 완료"
else
    log_error "TypeScript 컴파일 오류가 발생했습니다."
fi

# 최종 안내
echo -e "${GREEN}"
echo "=================================================="
echo "✅ 설치가 완료되었습니다!"
echo "=================================================="
echo -e "${NC}"

echo "다음 단계:"
echo "1. .env 파일에서 필요한 환경 변수를 설정하세요"
echo "   - GOV_API_KEY: 국토교통부 API 키"
echo "   - DATABASE_URL: PostgreSQL 연결 문자열"
echo "   - JWT_SECRET: JWT 시크릿 키"
echo ""
echo "2. 개발 서버를 시작하세요:"
echo "   npm run dev              # 모든 서비스 시작"
echo "   npm run docker:up        # Docker로 인프라 시작"
echo ""
echo "3. 접속 주소:"
echo "   - 프론트엔드: http://localhost:3001"
echo "   - 백엔드 API: http://localhost:3000"
echo "   - API 문서: http://localhost:3000/api/docs"
echo ""
echo "4. 유용한 명령어:"
echo "   npm run db:studio        # 데이터베이스 관리"
echo "   npm run lint             # 코드 검사"
echo "   npm run test             # 테스트 실행"
echo ""

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 파일을 반드시 설정해주세요!${NC}"
fi

echo "문제가 있으면 README.md 파일을 참조하거나 이슈를 등록해주세요."
echo "Happy coding! 🚀"