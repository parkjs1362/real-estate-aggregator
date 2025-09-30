# 🚀 GitHub Desktop으로 업로드하기

GitHub Desktop이 설치되었습니다! 이제 프로젝트를 업로드하세요.

## 📋 단계별 가이드

### 1단계: GitHub에 로그인

1. GitHub Desktop이 자동으로 실행되었습니다
2. "Sign in to GitHub.com" 버튼 클릭
3. 브라우저에서 GitHub 계정으로 로그인
4. "Authorize desktop" 클릭하여 권한 승인

### 2단계: 로컬 저장소 추가

1. GitHub Desktop 상단 메뉴에서:
   - **File** → **Add Local Repository** 클릭

2. "Choose..." 버튼 클릭 후 다음 경로 입력 또는 선택:
   ```
   C:\WINDOWS\system32\real-estate-aggregator
   ```

3. "Add Repository" 버튼 클릭

### 3단계: Repository 게시 (Publish)

1. 저장소가 추가되면 상단에 **"Publish repository"** 버튼이 보입니다
2. 버튼을 클릭하면 대화상자가 나타납니다:
   - **Name**: `real-estate-aggregator` (이미 입력되어 있음)
   - **Description**: `한국 부동산 데이터 집계 플랫폼` (선택사항)
   - **Keep this code private** 체크 해제 (공개 저장소)
   - **Organization**: None (개인 계정)

3. **"Publish Repository"** 버튼 클릭

### 4단계: 업로드 완료 확인

업로드가 완료되면:
- GitHub Desktop 하단에 "Last fetched just now" 메시지 표시
- 브라우저에서 확인: https://github.com/parkjs1362/real-estate-aggregator

---

## ⚠️ 문제 해결

### "Repository not found" 오류
- GitHub에 로그인이 제대로 되었는지 확인
- 계정이 parkjs1362인지 확인

### "Repository already exists" 오류
이미 GitHub에 repository가 있는 경우:
1. GitHub Desktop에서 **Repository** → **Repository Settings** 클릭
2. "Remote" 탭에서 확인:
   - **Primary remote repository (origin)**
   - URL: `https://github.com/parkjs1362/real-estate-aggregator.git`
3. "Publish branch" 버튼 클릭 (Publish repository 대신)

### 경로를 찾을 수 없는 경우
탐색기에서 직접 폴더를 복사:
1. Windows 탐색기 열기
2. 주소창에 입력: `C:\WINDOWS\system32\real-estate-aggregator`
3. 폴더를 `C:\Users\CNXK\Documents\` 로 복사
4. GitHub Desktop에서 새 경로로 추가

---

## ✅ 업로드 확인 사항

업로드가 성공하면 다음이 GitHub에 표시됩니다:
- ✅ README.md (프로젝트 설명)
- ✅ package.json (루트 설정)
- ✅ docker-compose.yml (도커 설정)
- ✅ apps/ (API & Web 애플리케이션)
- ✅ packages/ (데이터베이스, 수집기)
- ✅ .github/workflows/ (CI/CD 파이프라인)
- ✅ 총 28개 파일

---

## 🎉 다음 단계

업로드가 완료되면:
1. GitHub 페이지에서 README.md 확인
2. QUICK_START.md 가이드에 따라 로컬 개발 환경 설정
3. 국토교통부 API 키 발급 (https://data.go.kr)
4. .env 파일 설정 후 개발 시작!

**프로젝트 URL**: https://github.com/parkjs1362/real-estate-aggregator