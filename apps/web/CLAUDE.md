# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contigo is a monorepo containing a Next.js 14 web application for a health and accompaniment platform for seniors and foreigners. The monorepo root (`/contigo`) contains `apps/web` and `apps/mobile`.

## Common Commands

```bash
cd apps/web
npm run dev      # Start development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Architecture

The web app follows Clean Architecture with domain-driven organization:

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with theme providers
│   ├── page.tsx            # Landing/home page
│   ├── onboarding/         # User onboarding flow
│   ├── admin/             # Admin dashboard routes
│   │   └── questionnaires/
│   │       └── [id]/      # Questionnaire editor (preview, edit)
│   └── api/               # API routes (route.ts files)
├── components/
│   ├── ui/                # Atomic reusable UI (Button, Progress, Label)
│   └── onboarding/        # Onboarding step components (Stepper, Steps)
├── domain/                # Business logic layer
│   └── onboarding/
│       ├── types.ts       # TypeScript interfaces
│       ├── contracts.ts   # Zod schemas for validation
│       ├── services.ts    # Business logic functions
│       ├── validations.ts # Field-level validation rules
│       └── questionnaire.ts # Questionnaire data structures
├── infrastructure/
│   └── store/             # Zustand state management
│       ├── onboarding-store.ts
│       └── questionnaire-store.ts
└── lib/
    └── utils.ts           # Utilities (cn() classname helper)
```

## Onboarding Flow

The onboarding is a multi-step wizard managed by Zustand (`onboarding-store.ts`) and rendered via components in `src/components/onboarding/`. Steps include document upload, video recording, and evaluation questionnaire.

## Admin Routes

- `/admin/questionnaires` - List all questionnaires
- `/admin/questionnaires/[id]` - Edit a specific questionnaire
- `/admin/questionnaires/[id]/preview` - Preview questionnaire as user would see it

## Validation Rules (per specs)

- **Documents**: Allowed formats PDF, DOC, DOCX; max 10MB
- **Videos**: Allowed formats MP4, MOV; max 1GB per file; min 60 seconds duration
- **Evaluation**: Score > 80% required to unlock next step
- **Navigation**: All fields must be 100% complete before "Next" button enables

## Tech Stack

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS with custom theme (primary: #00668A, font: Lexend)
- Zustand for state management
- Zod + react-hook-form for validation
- Radix UI for accessible primitives
- Lucide React for icons