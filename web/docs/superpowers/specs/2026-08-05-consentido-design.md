# ConSentido — Design Spec

**Date**: 2026-08-05
**Type**: Complete application replacement (Contigo → ConSentido)

## Overview

ConSentido ("Palabras con intención") is a SaaS platform for creating, personalizing, and sending greeting messages via SMS. Users browse AI-curated message libraries by occasion, select a message, provide recipient details, and schedule SMS delivery.

The existing Contigo web app (companion hiring platform with onboarding wizard, psychometric evaluations, CV uploads) will be replaced entirely with ConSentido.

## Architecture

- **Frontend**: Next.js 14 App Router + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions in Deno)
- **Auth**: None — public flow, no login required
- **State**: React Context for wizard/cart state across steps

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Landing page with CTA "Crear nuevo mensaje" |
| `/crear/ocasion` | `OccasionStep` | Step 1/4: Select occasion category |
| `/crear/mensajes` | `MessagesStep` | Step 2/4: Browse 5 messages, pick one |
| `/crear/confirmar` | `ConfirmStep` | Step 3/4: Recipient details + review |
| `/crear/pago` | `PaymentStep` | Step 4/4: Checkout + payment redirect |
| `/api/messages` | API route | Fetch messages by occasion |
| `/api/orders` | API route | Create order in database |

## Database Schema (Supabase)

### `occasions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | Primary key |
| `name` | `text` | Display name (e.g. "Cumpleaños") |
| `slug` | `text` (unique) | URL-friendly slug |
| `description` | `text` | Short description shown on card |
| `icon_color` | `text` | Hex color for icon circle background |
| `icon_svg` | `text` | Inline SVG path data |
| `sort_order` | `int` | Display order |

### `messages`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | Primary key |
| `occasion_id` | `uuid` (FK → occasions) | Linked occasion |
| `text` | `text` | The message content |
| `created_at` | `timestamptz` | Created timestamp |

### `orders`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | Primary key |
| `occasion` | `text` | Occasion name (denormalized) |
| `message_text` | `text` | Selected message text |
| `recipient_name` | `text` | Recipient's name |
| `recipient_phone` | `text` | Recipient's phone number (Colombia) |
| `sender_name` | `text` | Sender's name |
| `scheduled_date` | `date` | Scheduled delivery date |
| `status` | `text` | `pending`, `sent`, `failed` |
| `created_at` | `timestamptz` | Order creation timestamp |

### Index
- On `orders(status, scheduled_date)` for the Edge Function scheduler query.

## Edge Function: `send-sms`

- **Runtime**: Deno
- **Trigger**: Supabase `pg_cron` job running every minute
- **Logic**: Query `orders WHERE status = 'pending' AND scheduled_date <= CURRENT_DATE`, send SMS via Twilio (or log for now), update status to `sent` or `failed`.

## Screen Details

### 1. Home (`/`)

- Server Component (static).
- Header: Logo "ConSentido" (blue `#2269ED` + dark `#0B3789`) + cart icon with item count badge.
- Hero section: large title "Palabras con intención", subtitle, primary CTA "Crear nuevo mensaje" → `/crear/ocasion`.
- Footer: "© 2026 ConSentido — Palabras con intención".

### 2. Step 1: Occasion (`/crear/ocasion`)

- Header + breadcrumb "Inicio > Paso 1 / 4".
- Title: "¿Cuál es la ocasión?"
- 6 category cards in 3x2 grid, loaded from `occasions` table.
- Each card: colored icon circle + name + description.
- Hover: blue border, shadow, icon circle turns blue.
- Click saves selected occasion to wizard state → navigates to `/crear/mensajes`.

### 3. Step 2: Messages (`/crear/mensajes`)

- Breadcrumb "← Atrás > Paso 2 / 4".
- Title: "Mensajes para {ocasión}" + subtitle.
- 5 numbered message cards showing text.
- Cards loaded from `messages` filtered by `occasion_id`, randomized (5 at a time).
- Click selects a message → navigates to `/crear/confirmar`.
- "Generar más mensajes" button loads 5 new random messages (same occasion).

### 4. Step 3: Confirm (`/crear/confirmar`)

- Title: "Confirma los detalles" + subtitle.
- Message display card with occasion badge + text preview.
- "Editar" (back to step 2) and "Eliminar" (clear selection) buttons.
- Form fields: recipient name, recipient phone (Colombia format), sender name, scheduled date.
- Validation: all required, valid phone, future date.
- Primary CTA "Continuar con el pago" → `/crear/pago`.

### 5. Step 4: Payment (`/crear/pago`)

- Breadcrumb "Paso 4 / 4".
- Title: "Checkout" + security subtitle.
- Summary panel: occasion, recipient, sender, message text, total ($4,990 COP per message).
- Pre-filled delivery data fields.
- Primary CTA "Continuar con el pago" → creates order in DB (`POST /api/orders`) → shows confirmation modal → toast redirect.

### Modals

- **Confirmación**: green check + "¡Casi listo!" + redirect message + "Volver al inicio" / "Crear otro mensaje".
- **Toast**: green strip "Te dirigiremos a la pasarela de pagos".

## State Management

React Context (`WizardContext`) holding:
- `occasion`: selected occasion object
- `messages`: current displayed 5 messages
- `selectedMessage`: chosen message
- `orderData`: recipient name, phone, sender name, scheduled date

No persistence needed between sessions (public flow).

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2269ED` | Buttons, active states, icons |
| Primary Dark | `#1B5CD8` | Button hover |
| Primary Darkest | `#0B3789` | Logo "Sentido" |
| Background | `#FAFCFE` | Page background |
| Gray body | `#E5E9F0` | Outer background |
| Border | `#E8E8E8` | Card borders |
| Text primary | `#222222` | Headings |
| Text secondary | `#4A4A4A` | Body text |
| Text muted | `#777777` | Subtle text |

## Typography

Font: **Poppins** (weights 400, 500, 600, 700), loaded from Google Fonts.

## Deletion List

All existing Contigo code to be removed:
- `src/app/admin/**`
- `src/app/api/admin/**`
- `src/app/api/questionnaires/**`
- `src/app/api/requests/**`
- `src/app/api/upload/**`
- `src/app/onboarding/**`
- `src/app/about/**`
- `src/app/contact/**`
- `src/app/faq/**`
- `src/app/pricing/**`
- `src/app/dashboard/**`
- `src/components/onboarding/**`
- `src/components/ui/dialog.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/reveal.tsx`
- `src/domain/**`
- `src/infrastructure/store/**`
- `src/infrastructure/storage/**`
- `src/lib/auth.ts`
- `src/lib/turso.ts`
- `src/lib/sanitize.ts`
- `data/**`
- `turso-migration*.sql`
- `supabase/migrations/20260504_create_requests.sql`

Kept:
- `src/lib/utils.ts` (`cn()` helper)
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `package.json` (updated dependencies), `tsconfig.json`, `tailwind.config.js`, `next.config.js`, `postcss.config.js`

New:
- `src/app/layout.tsx` (updated with Poppins)
- `src/app/globals.css` (ConSentido theme)
- `src/lib/supabase.ts` (Supabase client)
- `src/context/wizard-context.tsx` (wizard state)
- `supabase/migrations/` (new migrations)
- `supabase/functions/send-sms/` (Edge Function)
