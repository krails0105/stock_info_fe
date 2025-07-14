# 주식 정보 웹사이트 (Stock Info Frontend)

주식 초보자를 위한 정보 제공 웹사이트 프론트엔드입니다.

## 🚀 주요 기능

### 현재 구현된 기능
- **시장 지수 실시간 조회**: KOSPI, KOSDAQ, KRX100 지수 표시
- **섹터별 종목 분류**: 반도체, 자동차, 바이오, 화학, 금융, 에너지 등
- **종목 상세 정보**: 현재가, 등락률, 거래량, PER, PBR, 시가총액
- **종목 정렬 및 필터**: 다양한 기준으로 종목 정렬 가능
- **주요 뉴스**: 관련 뉴스 표시
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

### 예정된 기능
- 종목 검색 기능
- 실시간 차트 표시
- 뉴스 상세 조회 및 요약
- 즐겨찾기 기능
- 알림 설정
- 종목 비교 기능

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **UI/UX**: Tailwind CSS, Lucide React Icons
- **HTTP Client**: Axios
- **Charts**: Recharts (예정)
- **Routing**: React Router DOM (예정)

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Layout.tsx      # 전체 레이아웃
│   ├── HomePage.tsx    # 홈페이지
│   └── SectorPage.tsx  # 섹터별 종목 페이지
├── services/           # API 통신 서비스
│   └── api.ts         # 백엔드 API 호출
├── App.tsx            # 메인 앱 컴포넌트
└── main.tsx           # 앱 엔트리 포인트
```

## 🚀 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 빌드 파일 미리보기
```bash
npm run preview
```

## 🔧 환경 설정

환경 변수 파일 (`.env`) 생성:
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_NODE_ENV=development
```

## 📡 API 연동

백엔드 API 서버와 연동하기 위한 주요 엔드포인트:

- `GET /api/indices` - 시장 지수 조회
- `GET /api/sectors` - 섹터 목록 조회
- `GET /api/stocks` - 종목 목록 조회
- `GET /api/stocks/:code` - 특정 종목 조회
- `GET /api/news` - 뉴스 조회

## 🎨 디자인 시스템

- **주요 색상**: 
  - 상승: `text-red-600` (빨간색)
  - 하락: `text-blue-600` (파란색)
  - 중립: `text-gray-600` (회색)
- **카드 스타일**: 흰색 배경, 그림자, 둥근 모서리
- **버튼**: 파란색 primary 버튼, hover 효과

## 📱 반응형 디자인

- **모바일**: 320px 이상
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상

## 🔮 향후 계획

1. **실시간 데이터 연동**: WebSocket을 통한 실시간 주가 업데이트
2. **차트 기능**: 종목별 가격 차트 구현
3. **검색 기능**: 종목명, 코드 검색
4. **사용자 기능**: 로그인, 즐겨찾기, 알림
5. **PWA 지원**: 모바일 앱처럼 사용 가능

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새기능 추가'`)
4. 브랜치에 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

---

**투자 유의사항**: 이 웹사이트는 정보 제공 목적으로만 사용되며, 투자 권유나 조언이 아닙니다. 투자 결정은 본인 책임 하에 신중하게 하시기 바랍니다.
