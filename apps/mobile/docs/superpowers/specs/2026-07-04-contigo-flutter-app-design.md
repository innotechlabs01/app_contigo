# Contigo Flutter Mobile App — Design Specification

## Overview

Contigo is a health and companionship platform connecting older adults and foreigners with vetted companions ("Compañeros"). This spec covers the Flutter mobile application, complementing the existing Next.js web app.

**Stitch Project:** `projects/3298799792410885224` — "App Contigo Landing Page"
**Design System:** "The Empathetic Anchor" (Light) / "Sereno Night" (Dark)
**Platform:** iOS + Android (Flutter)

## Architecture

**Pattern:** Hybrid Feature-First + Clean Architecture + MVVM

```
lib/
  core/                  → Theme engine, routing, network, storage, error handling
  features/
    landing/             → data/ domain/ presentation/
    intro/               → data/ domain/ presentation/
    client/              → data/ domain/ presentation/
    companion/           → data/ domain/ presentation/
    settings/            → data/ domain/ presentation/
    auth/                → data/ domain/ presentation/
  shared/                → Reusable UI components
  l10n/                  → ARB files, localization
```

### Layer Responsibilities (per feature)

- **data/** — Repositories, DTOs, data sources (API, local), mappers
- **domain/** — Entities, use cases, repository interfaces (pure Dart)
- **presentation/** — Screens, ViewModels (Riverpod), feature-specific widgets

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Flutter 3.35+ |
| Design | Material 3 |
| State | Riverpod 3.x |
| Navigation | go_router |
| HTTP | Dio |
| Auth | Clerk |
| Local storage | Hive + flutter_secure_storage |
| Localization | intl + flutter_localizations |
| Serialization | Freezed + json_serializable |
| Testing | flutter_test, mocktail, integration_test |

## Feature Breakdown

### 1. Landing (`/`)
- Hero section with value proposition
- Services overview
- Testimonials/carousel
- CTA to start (intro or client flow)

### 2. Auth (`auth`)
- Clerk integration for session management
- Role-based routing (companion vs client vs admin)
- Protected route guards via go_router redirect

### 3. App Introduction (`/intro`)
- First-launch carousel (3-4 screens) introducing Contigo
- Screen 1: Welcome — "Tu salud y compañía, siempre contigo"
- Screen 2: For Clients — Find trusted companions for medical/personal accompaniment
- Screen 3: For Companions — Register on the web, manage your work from the app
- Screen 4: Get Started — CTA to enter the app
- Shown once (SharedPreferences flag), skippable
- Premium motion: parallax backgrounds, staggered text reveals, page indicator

### 4. Client (`/client/`)
- Browse services (listing with categories)
- New service request form (detailed form from Stitch)
- My requests (list with status tracking)
- Filters (bottom sheet with service type, location, date)

### 5. Companion Dashboard (`/companion/`)
- Bottom navigation: Home, Requests, Calendar, Earnings
- **Home:** Stats cards, upcoming sessions, recent activity
- **Requests:** Service requests from clients, accept/reject
- **Calendar:** Schedule view with session cards
- **Earnings:** Balance, history, payout info

### 6. Settings (`/settings`)
- Profile (edit personal info, photo)
- Preferences (notifications, language, theme)
- Security (Clerk-managed)
- App info, logout

## Entities (Domain Models)

```dart
User { id, email, name, role, createdAt }
CompanionApplication { id, userId, status, evaluationScore, cvUrl, 
  presentationVideoUrl, referenceVideoUrl, personalInfo, serviceTypes, createdAt }
ServiceRequest { id, clientId, companionId, serviceType, status, 
  scheduledDate, location, details, createdAt }
Session { id, companionId, clientId, date, duration, status, notes }
Earning { id, companionId, amount, sessionId, date, status }
Questionnaire { id, questions, passingScore, isPublished }
```

## Routing

```dart
/ → Landing
/intro → App introduction (first launch)
/client/services → Browse services
/client/request → New request form
/client/requests → My requests
/companion/dashboard → Home (tab)
/companion/requests → Requests (tab)
/companion/calendar → Calendar (tab)
/companion/earnings → Earnings (tab)
/settings → Profile
/settings/notifications → Notification prefs
```

## Design System

### Light Theme ("The Empathetic Anchor")
- **Primary:** `#00668A`
- **Primary Container:** `#85CDF7`
- **Surface system:** `surface` (`#F9F9F9`) → `surface-container-low` → `surface-container` → `surface-container-high` → `surface-container-highest` → `surface-dim`
- **Typography:** Lexend (headline, body), Plus Jakarta Sans (label)
- **No borders:** Sectioning via tonal background shifts
- **Radius:** Full (56px buttons), lg (16px cards), md (12px inputs)
- **Gradients:** Primary → Primary Container at 135° for CTAs
- **Shadows:** `0px 12px 32px rgba(0, 102, 138, 0.08)` — tinted, ambient
- **Glassmorphism:** 70% opacity surface + 20px backdrop-blur for overlays

### Dark Theme ("Sereno Night")
- Inverse surface palette
- Same typography, spacing, and radius tokens
- Dark-adapted gradients and shadows

### Theme Extensions
`ContigoColors`, `ContigoTypography`, `ContigoSpacing`, `ContigoRadius`, `ContigoGradients`, `ContigoShadows`, `ContigoMotion`

## Component Library

| Component | Properties |
|-----------|------------|
| ContigoButton | primary (gradient), secondary (tonal), tertiary (text), 56px min height, scale 0.98 on press |
| ContigoInput | large rounded md, visible label, glow focus state, surface-container-highest bg |
| ContigoCard | tonal backgrounds, no borders, lg radius, companion card variant |
| ContigoStepper | 4-step horizontal, active/completed/pending states |
| ContigoBottomSheet | filter options, service selection |
| ContigoDialog | confirmation, error, success variants |
| ContigoChip | service type tags, status badges |
| ContigoAvatar | photo + online/offline indicator |
| ContigoCalendar | month view with session markers |
| ContigoStatsCard | count/amount with label and icon |
| ContigoEmptyState | illustration + message + action button |
| ContigoShimmer | skeleton loaders per component type |
| ContigoStatusPill | pending/approved/rejected/in_review |

## API Integration

- **Dio** with interceptor chain: Clerk Auth → Retry (3, exp backoff) → Refresh → Offline → Logging → Error
- **Endpoints:**
  - `POST /api/requests` (multipart form data)
  - `GET /api/requests/check-id/{idNumber}`
  - `GET /api/questionnaires`
  - `PATCH /api/requests/{id}` (admin — for future)
- **Result Pattern:** `Either<Failure, Success>` via sealed classes
- **Caching:** Hive for questionnaires, offline request queue

## Motion

- Page transitions: Shared Axis (horizontal push)
- Stepper: Fade Through with directional slide
- Buttons: Scale 0.98 press → spring release
- Cards: Staggered fade in on lists
- Shimmer: Skeleton loaders on first load
- Bottom sheets: Slide up with spring curve
- Stats: Animated counter
- Hero transitions on companion profiles

## Testing

- Domain: >95% coverage (pure Dart, no Flutter dep)
- Data: >90% (repos with mock API)
- ViewModels: >85% (Riverpod test utils)
- Widget: >80% (golden tests for components)
- Integration: Critical paths (client service request flow)

## Localization

- English (en) default
- Spanish (es-CO)
- ARB files in `lib/l10n/`
- All strings via `AppLocalizations.of(context)`

## Accessibility

- WCAG AA contrast ratios
- 56px minimum touch targets
- Semantic labels on all components
- Dynamic font scaling support
- Keyboard navigation support
- Screen reader descriptions

## Performance

- Const widgets everywhere
- Lazy loading / pagination for lists
- Image caching (cached_network_image)
- Minimal rebuilds via Riverpod selectors
- 60fps target
