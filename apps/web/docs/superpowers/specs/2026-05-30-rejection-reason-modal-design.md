# Design: Rejection Reason Modal

## Context

When an admin rejects a user request, there is no confirmation step and no way to record why the rejection occurred. The rejection message shown to the user is hardcoded. This feature adds a modal dialog for the admin to enter a free-text rejection reason, persists it to the database, and displays it to the rejected user.

## Requirements

- Admin clicks "Rechazar" → modal appears with a textarea for the rejection reason
- The reason is required (cannot reject without providing a reason)
- The reason is saved to the `requests` table via the PATCH API
- The rejected user sees the specific reason on their rejection screen
- The modal uses Radix UI Dialog for accessibility and reusability

## Changes

### 1. Database Migration

New column `rejection_reason` on the `requests` table:

```sql
ALTER TABLE requests ADD COLUMN rejection_reason TEXT;
```

### 2. Reusable Dialog Component

New file: `src/components/ui/dialog.tsx`

- Wraps `@radix-ui/react-dialog` primitives
- Exports: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`
- Styled with Tailwind, consistent with existing design system (rounded-3xl, shadows, Lexend font)

### 3. Rejection Modal (Admin UI)

Modified file: `src/app/admin/requests/page.tsx`

- New state: `showRejectModal` (boolean), `rejectReason` (string), `rejectingId` (string | null)
- "Rechazar" button opens the modal instead of calling API directly
- Modal contains:
  - Title: "Motivo de rechazo"
  - Textarea with placeholder "Describe el motivo del rechazo..."
  - "Cancelar" button (closes modal, clears reason)
  - "Confirmar rechazo" button (disabled if reason is empty, calls API)
- `handleReject` → sets `rejectingId` and opens modal
- `handleConfirmReject` → PATCH `/api/requests/${id}` with `{ status: 'rejected', rejection_reason: reason }`

### 4. API PATCH Update

Modified file: `src/app/api/requests/[id]/route.ts`

- Accept `rejection_reason` in request body
- Include `rejection_reason` in the SQL UPDATE statement
- Validation: if status is `rejected`, `rejection_reason` must be a non-empty string

### 5. Status Check API Update

Modified file: `src/app/api/requests/check-status/[idNumber]/route.ts`

- Include `rejection_reason` in the response when status is `rejected`

### 6. User Rejection Screen Update

Modified file: `src/components/onboarding/onboarding-container.tsx`

- When status is `rejected`, fetch the request to get `rejection_reason`
- Display the reason below the "No apto" heading
- Fallback to generic message if reason is not available

## Data Flow

```
Admin clicks "Rechazar"
  → Modal opens (state: showRejectModal=true)
  → Admin types reason
  → Admin clicks "Confirmar rechazo"
  → PATCH /api/requests/{id} { status: 'rejected', rejection_reason: '...' }
  → API updates DB: status='rejected', rejection_reason='...', review_date=now
  → Admin UI refreshes list
  → User polls /api/requests/check-status/{idNumber}
  → Response includes rejection_reason
  → User sees reason on rejection screen
```

## Out of Scope

- Editing or updating rejection reasons after initial rejection
- Predefined rejection reason templates/categories
- Email notifications for rejection
- Batch rejection with single reason
