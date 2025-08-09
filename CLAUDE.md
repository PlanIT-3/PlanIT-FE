# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 중요 지침
- 모든 응답은 한국어로 제공
- 코드 주석과 변수명은 영어 사용
- 에러 메시지와 로그는 한국어로 표시

## Project Overview

PlanIT-FE is a Vue.js 3 financial planning application focused on investment goals, ISA accounts, and portfolio management. The app helps users set financial goals, track progress, and receive investment recommendations.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Setup
- `npm install` - Install dependencies (Node.js required)

### Mobile Development (Capacitor)
- `npm run build:mobile` - Build web app and sync to mobile platforms
- `npm run cap:sync` - Sync web assets to native projects
- `npm run cap:android` - Open Android project in Android Studio
- `npm run cap:ios` - Open iOS project in Xcode (macOS only)
- `npm run cap:run:android` - Run app on Android device/emulator
- `npm run cap:run:ios` - Run app on iOS device/simulator

### Deployment Commands
- `npm run deploy:netlify` - Deploy to Netlify
- `npm run deploy:vercel` - Deploy to Vercel  
- `npm run deploy:gh-pages` - Deploy to GitHub Pages

## Architecture & Structure

### Technology Stack
- **Frontend**: Vue 3 with Composition API
- **Mobile**: Capacitor 7.x for native iOS/Android deployment
- **State Management**: Pinia stores
- **Routing**: Vue Router 4 with modular route organization
- **Styling**: TailwindCSS 4.x with custom design system
- **Charts**: ECharts via vue-echarts for financial data visualization
- **HTTP Client**: Axios with interceptors for authentication
- **Build Tool**: Vite with Vue DevTools integration

## Backend Connection Tasks

### Priority Tasks for Backend Integration

#### 1. API Service Integration
- **File**: `src/services/api.js`
- **Task**: Configure backend API base URL and authentication endpoints
- **Status**: Base structure exists, needs backend endpoint configuration
- **Requirements**:
  - Set up proper VITE_API_BASE_URL environment variable
  - Implement authentication token management
  - Add request/response interceptors for error handling

#### 2. Authentication Flow Connection
- **Files**: `src/composables/business/useAuth.js`, `src/stores/user.js`
- **Task**: Connect frontend auth flow to backend authentication endpoints
- **Status**: Structure exists, needs backend integration
- **Requirements**:
  - Login/logout API calls
  - Token refresh mechanism
  - User session management
  - Social login integration (Kakao, Naver)

#### 3. Financial Data API Integration
- **Files**: `src/services/investment/isaService.js`, `src/stores/investment.js`, `src/stores/goal.js`
- **Task**: Connect financial features to backend APIs
- **Status**: Service layer partially implemented
- **Requirements**:
  - ISA account management APIs
  - Investment goal CRUD operations
  - Portfolio data fetching
  - Bank account linking APIs

#### 4. Real-time Data Updates
- **Task**: Implement real-time financial data updates
- **Requirements**:
  - WebSocket connection for live portfolio updates
  - Stock price feeds
  - Goal progress notifications
  - Portfolio rebalancing alerts

#### 5. Error Handling & Offline Support
- **Task**: Robust error handling for API failures
- **Requirements**:
  - Network error recovery
  - Offline data caching
  - User-friendly error messages
  - Retry mechanisms for failed requests

### Environment Configuration

The app uses Vite environment variables:
- `VITE_API_BASE_URL` - Backend API base URL (defaults to localhost:8080/api)
- `VITE_WS_URL` - WebSocket URL for real-time updates
- `VITE_KAKAO_CLIENT_ID` - Kakao social login client ID
- `VITE_NAVER_CLIENT_ID` - Naver social login client ID

### API Endpoints to Implement

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `POST /auth/social/kakao` - Kakao social login
- `POST /auth/social/naver` - Naver social login

#### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `POST /user/bank-link` - Link bank account

#### Goals & Investments
- `GET /goals` - Get user goals
- `POST /goals` - Create new goal
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal
- `GET /investments/portfolio` - Get portfolio data
- `GET /investments/isa` - Get ISA account info
- `POST /investments/isa` - Register ISA account

#### Market Data
- `GET /market/stocks` - Get stock data
- `GET /market/prices/:symbol` - Get stock price
- `GET /recommendations` - Get investment recommendations

## Key Implementation Notes

### Current Development Status
- Core architecture and routing established
- Basic component library implemented
- API integration layer structure complete
- Backend connection tasks identified and prioritized
- Environment configuration prepared for backend integration

### Next Steps for Backend Integration
1. Configure backend API endpoints in environment variables
2. Implement authentication service connection
3. Connect financial data APIs
4. Add real-time data updates
5. Implement comprehensive error handling
6. Add offline support and caching

### Mobile Configuration (Capacitor)
- **App ID**: `com.planit.app`
- **App Name**: `PlanIT`  
- **Web Directory**: `dist` (Vite build output)
- **Platforms**: Android and iOS native projects in `/android` and `/ios` directories
- **Configuration**: `capacitor.config.json`
  - Android HTTPS scheme enabled
  - Splash screen configuration (3초 표시)
  - 다크 테마 배경색 (#1a202c)

### Capacitor 웹앱 개발 워크플로우
1. **개발**: `npm run dev` - 웹 개발 서버에서 개발
2. **빌드**: `npm run build:mobile` - 웹 빌드 + 네이티브 동기화
3. **테스트**: 
   - Android: `npm run cap:run:android` 
   - iOS: `npm run cap:run:ios`
4. **배포**: Android Studio/Xcode에서 빌드 및 배포

## 웹 배포 가이드

### 환경별 설정 파일
- `.env.development` - 개발 환경 설정
- `.env.production` - 프로덕션 환경 설정 
- `.env.example` - 환경 변수 템플릿

### 배포 플랫폼별 설정

#### 1. Netlify 배포
1. **설정**: `netlify.toml` 파일로 자동 설정
2. **배포**: `npm run deploy:netlify` 또는 Git 연동 자동 배포
3. **환경변수**: Netlify 대시보드에서 환경변수 설정
4. **도메인**: 자동 생성 또는 커스텀 도메인 설정

#### 2. Vercel 배포  
1. **설정**: `vercel.json` 파일로 자동 설정
2. **배포**: `npm run deploy:vercel` 또는 Git 연동 자동 배포
3. **환경변수**: Vercel 대시보드에서 환경변수 설정
4. **성능**: 자동 CDN 및 최적화 제공

#### 3. GitHub Pages 배포
1. **설정**: `.github/workflows/deploy.yml` GitHub Actions 설정
2. **배포**: main 브랜치 푸시 시 자동 배포
3. **환경변수**: GitHub Secrets에서 환경변수 설정
4. **도메인**: `username.github.io/repository` 또는 커스텀 도메인

### 배포 전 체크리스트
- [ ] 환경변수 설정 (.env.production)
- [ ] API 엔드포인트 확인 (백엔드 배포 완료)
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 소셜 로그인 클라이언트 ID 설정
- [ ] 도메인 설정 (필요시)

### 배포 후 확인사항
- [ ] 웹사이트 접속 확인
- [ ] API 연결 상태 확인
- [ ] 모바일 반응형 확인
- [ ] 소셜 로그인 기능 테스트
- [ ] 성능 최적화 확인 (Lighthouse)