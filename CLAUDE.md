# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Key Architectural Patterns

#### Modular Route Organization
Routes are organized by feature in separate files:
- `auth.js` - Authentication flows
- `onBoarding.js` - User onboarding process
- `goal.js` - Goal management
- `recommendation.js` - Investment recommendations
- `mypage.js` - User profile and settings
- `alarm.js` - Notification management
- `report.js` - Portfolio reports

#### Component Structure
- **Base Components** (`components/base/`) - Reusable UI primitives (buttons, inputs, modals)
- **Common Components** (`components/common/`) - Shared layout and navigation components
- **Feature Components** - Domain-specific components organized by feature area
- **Layout System** - Multiple layout variants (DefaultLayout, MainLayout, NavBarLayout, SubLayout)

#### State Management Architecture
- **Pinia Stores** (`stores/`) - Modular state management by domain (goal, investment, user)
- **Composables** (`composables/`) - Reusable business logic split into:
  - `business/` - Domain logic (auth, goals, portfolio analysis)
  - `ui/` - UI-specific logic (charts, forms, modals, notifications)

#### Service Layer
- **API Service** (`services/api.js`) - Centralized HTTP client with:
  - Automatic token refresh on 401 errors
  - Request/response interceptors with logging
  - Error handling utilities (`handleApiError`, `apiWrapper`)
  - File upload support
- **Feature Services** (`services/investment/`) - Domain-specific API integrations

### Financial Domain Features

#### Investment Management
- ISA (Individual Savings Account) registration and management
- Stock portfolio tracking and analysis
- Deposit and savings account integration
- Investment goal setting with progress tracking

#### User Onboarding Flow
- Bank account linking process
- Investment preference survey
- Risk assessment and profile creation
- Goal setup wizard

#### Analytics & Reporting
- Portfolio performance visualization using ECharts
- Progress tracking with circular progress indicators
- Rebalancing recommendations
- Investment goal achievement metrics

### Development Patterns

#### Authentication Flow
- JWT-based authentication with automatic token refresh
- Persistent login state using localStorage
- Route-level authentication guards (implementation in progress)

#### Error Handling
- Centralized API error handling with user-friendly messages
- Development-only console logging for debugging
- Graceful degradation for offline/network issues

#### Component Communication
- Props for parent-to-child data flow
- Pinia stores for global state
- Composables for shared business logic
- Event bus pattern for complex component interactions

### Asset Organization
- **Bank Icons** - SVG icons for major Korean banks (KB, 신한, 우리, etc.)
- **Social Login** - Kakao and Naver authentication assets
- **Visual Assets** - Background images and themed graphics (space/lunar theme)

### Code Quality Tools
- **ESLint** with Naver config for Korean development standards
- **Prettier** for consistent code formatting
- **Vue DevTools** integration for debugging

## Environment Configuration

The app uses Vite environment variables:
- `VITE_API_BASE_URL` - Backend API base URL (defaults to localhost:8080/api)

### Mobile Configuration
- **App ID**: `com.planit.app` (defined in capacitor.config.json)
- **App Name**: `PlanIT`
- **Web Directory**: `dist` (Vite build output)
- **Platforms**: Android and iOS native projects in `/android` and `/ios` directories

## Key Implementation Notes

### Current Development Status
- Core architecture and routing established
- Basic component library implemented
- API integration layer complete with auth handling
- Several feature areas marked as "구현 예정" (implementation pending)
- State management structure defined but not fully implemented

### Modal System
Recent development includes a modal component system for account registration flows, particularly for ISA accounts and deposit registration.

### Navigation Structure
The app uses a bottom navigation pattern with conditional header layouts based on route metadata (`meta: { layout: "noHeader" }`).

### Authentication Integration
While the API service includes comprehensive JWT handling, the actual authentication guards and user session management appear to be in development phase.