# GitHub 업로드 가이드

## 현재 상황
프로젝트 파일들이 로컬에 생성되었으나, Git 인증 문제로 자동 push가 실패했습니다.

## 해결 방법 (3가지 옵션)

### 옵션 1: GitHub Desktop 사용 (가장 쉬움) ⭐ 추천

1. GitHub Desktop 설치: https://desktop.github.com/
2. GitHub Desktop 실행 → File → Add Local Repository
3. 경로 선택: `C:\WINDOWS\system32\real-estate-aggregator`
4. "Publish repository" 버튼 클릭
5. Repository name: `real-estate-aggregator` 입력
6. "Publish Repository" 클릭

### 옵션 2: Personal Access Token 재생성

현재 token이 작동하지 않는 이유:
- Fine-grained token의 권한 부족 가능성
- 또는 token scope 설정 오류

새 토큰 생성:
1. https://github.com/settings/tokens 접속
2. "Generate new token" → "Generate new token (classic)" 선택 ⚠️ Classic 선택 필수
3. 권한 체크:
   - [x] repo (전체 선택)
   - [x] workflow
   - [x] write:packages
4. "Generate token" 클릭
5. 생성된 토큰 복사

터미널에서 실행:
```bash
cd /c/WINDOWS/system32/real-estate-aggregator
git remote set-url origin https://parkjs1362:[새토큰]@github.com/parkjs1362/real-estate-aggregator.git
git push -u origin main
```

### 옵션 3: Git Bundle 사용

Git bundle 파일이 생성되어 있습니다: `C:\Users\CNXK\real-estate-aggregator.tar.gz`

1. 빈 repository에서 시작:
   - GitHub에서 real-estate-aggregator repository 삭제
   - 새로 생성 (Initialize with README 체크 안 함)

2. 로컬에서 bundle 적용:
```bash
# 새 디렉토리에 clone
git clone https://github.com/parkjs1362/real-estate-aggregator.git temp-repo
cd temp-repo

# bundle 파일로부터 가져오기
git pull /c/WINDOWS/system32/real-estate-aggregator.bundle main

# push
git push origin main
```

## 압축 파일 위치

- **Git Bundle**: `C:\WINDOWS\system32\real-estate-aggregator.bundle`
- **압축 아카이브**: `C:\Users\CNXK\real-estate-aggregator.tar.gz`

압축 파일을 다른 위치에서 풀고 거기서 git push 시도 가능합니다.

## 추가 도움

문제가 계속되면:
1. GitHub support에 토큰 권한 문의
2. SSH 키 설정으로 전환
3. 또는 GitHub Desktop 사용 (가장 확실함)