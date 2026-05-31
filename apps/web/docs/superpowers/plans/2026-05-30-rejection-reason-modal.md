# Rejection Reason Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a modal dialog for admins to enter a free-text rejection reason when rejecting a user request, persist it to the database, and display it to the rejected user.

**Architecture:** Install `@radix-ui/react-dialog`, create a reusable Dialog component, add `rejection_reason` column to the `requests` table, update the PATCH API to accept and store the reason, update the status-check API to return the reason, and update the user-facing rejection screen to display it.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI Dialog, Turso/SQLite

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add `@radix-ui/react-dialog` dependency |
| `src/components/ui/dialog.tsx` | Create | Reusable Dialog component wrapping Radix |
| `turso-migration-003-rejection-reason.sql` | Create | Migration to add `rejection_reason` column |
| `src/app/api/requests/[id]/route.ts` | Modify | Accept and store `rejection_reason` in PATCH |
| `src/app/api/requests/check-status/[idNumber]/route.ts` | Modify | Return `rejection_reason` in response |
| `src/app/admin/requests/page.tsx` | Modify | Add rejection modal with textarea |
| `src/components/onboarding/onboarding-container.tsx` | Modify | Display rejection reason to user |

---

### Task 1: Install @radix-ui/react-dialog

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install the dependency**

```bash
cd apps/web && npm install @radix-ui/react-dialog
```

- [ ] **Step 2: Verify installation**

```bash
cat package.json | grep "react-dialog"
```

Expected: `"@radix-ui/react-dialog": "^2.x.x"` in dependencies

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @radix-ui/react-dialog"
```

---

### Task 2: Create Reusable Dialog Component

**Files:**
- Create: `src/components/ui/dialog.tsx`

- [ ] **Step 1: Create the Dialog component**

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-100 bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 opacity-70 transition-opacity hover:opacity-100 hover:bg-slate-100">
        <X className="h-4 w-4 text-slate-400" />
        <span className="sr-only">Cerrar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-slate-800 leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

- [ ] **Step 2: Verify the file compiles**

```bash
npx tsc --noEmit src/components/ui/dialog.tsx
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/dialog.tsx
git commit -m "feat: add reusable Dialog component"
```

---

### Task 3: Database Migration

**Files:**
- Create: `turso-migration-003-rejection-reason.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- Migration 003: Add rejection_reason column to requests table
ALTER TABLE requests ADD COLUMN rejection_reason TEXT;
```

- [ ] **Step 2: Commit**

```bash
git add turso-migration-003-rejection-reason.sql
git commit -m "feat: add rejection_reason column migration"
```

---

### Task 4: Update PATCH API to Accept Rejection Reason

**Files:**
- Modify: `src/app/api/requests/[id]/route.ts:14-27`

- [ ] **Step 1: Update the PATCH handler**

Replace lines 14-27 of the PATCH handler with:

```typescript
    const { id } = await params;
    const body = await request.json();
    const { status, rejection_reason } = body;

    if (!status || !['pending', 'in_review', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    if (status === 'rejected' && (!rejection_reason || typeof rejection_reason !== 'string' || rejection_reason.trim().length === 0)) {
      return NextResponse.json(
        { error: 'El motivo de rechazo es requerido' },
        { status: 400 }
      );
    }

    await tursoClient.execute({
      sql: `UPDATE requests SET status = ?, rejection_reason = ?, review_date = ?, updated_at = ? WHERE id = ?`,
      args: [
        status,
        status === 'rejected' ? rejection_reason.trim() : null,
        status !== 'pending' ? new Date().toISOString() : null,
        new Date().toISOString(),
        id
      ]
    });
```

- [ ] **Step 2: Verify the file compiles**

```bash
npx tsc --noEmit src/app/api/requests/\[id\]/route.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/requests/\[id\]/route.ts
git commit -m "feat: accept rejection_reason in PATCH API"
```

---

### Task 5: Update Status Check API to Return Rejection Reason

**Files:**
- Modify: `src/app/api/requests/check-status/[idNumber]/route.ts:25-39`

- [ ] **Step 1: Update the SELECT query and response**

Replace lines 25-39 with:

```typescript
    const result = await tursoClient.execute({
      sql: 'SELECT status, rejection_reason FROM requests WHERE id_number = ? LIMIT 1',
      args: [idNumber]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    const status = result.rows[0][0];
    const rejectionReason = result.rows[0][1];

    return NextResponse.json({
      status,
      rejection_reason: rejectionReason || null
    });
```

- [ ] **Step 2: Verify the file compiles**

```bash
npx tsc --noEmit src/app/api/requests/check-status/\[idNumber\]/route.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/requests/check-status/\[idNumber\]/route.ts
git commit -m "feat: return rejection_reason in status check API"
```

---

### Task 6: Add Rejection Modal to Admin Requests Page

**Files:**
- Modify: `src/app/admin/requests/page.tsx:1-9,11-31,42-93,437-455`

- [ ] **Step 1: Add Dialog import**

Add to the imports at line 1-9:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
```

- [ ] **Step 2: Add rejection_reason to Request interface**

Add `rejection_reason?: string;` to the `Request` interface (after line 30):

```tsx
interface Request {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  phone: string;
  location: string;
  service_type: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  application_date: string;
  evaluation_score?: number;
  cv_file_name?: string;
  cv_url?: string;
  presentation_video_url?: string;
  presentation_video_name?: string;
  reference_video_url?: string;
  reference_video_name?: string;
  experience?: string;
  message?: string;
  rejection_reason?: string;
}
```

- [ ] **Step 3: Add state variables for the modal**

After line 47 (`const [searchQuery, setSearchQuery] = useState('');`), add:

```tsx
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
```

- [ ] **Step 4: Update handleReject to open the modal**

Replace the `handleReject` function (lines 81-93) with:

```tsx
  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return;
    try {
      await fetch(`/api/requests/${rejectingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejection_reason: rejectReason.trim() })
      });
      fetchRequests();
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectingId(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };
```

- [ ] **Step 5: Add the Dialog component before the closing `</div>` of the return statement**

Add before the final closing `</div>` (before line 461):

```tsx
      {/* Rejection Reason Modal */}
      <Dialog open={showRejectModal} onOpenChange={(open) => {
        if (!open) {
          setShowRejectModal(false);
          setRejectingId(null);
          setRejectReason('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Motivo de rechazo</DialogTitle>
            <DialogDescription>
              Describe el motivo por el cual se rechaza esta solicitud. Este motivo será visible para el usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Describe el motivo del rechazo..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-400 focus:outline-none text-sm resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectingId(null);
                setRejectReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              Confirmar rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
```

- [ ] **Step 6: Verify the file compiles**

```bash
npx tsc --noEmit src/app/admin/requests/page.tsx
```

Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/requests/page.tsx
git commit -m "feat: add rejection reason modal to admin requests"
```

---

### Task 7: Display Rejection Reason to User

**Files:**
- Modify: `src/components/onboarding/onboarding-container.tsx:25,31-64,117-129`

- [ ] **Step 1: Add state for rejection reason**

After line 25 (`const { stepIndex, status, reset, requestIdNumber, setStatus } = useOnboardingStore();`), add:

```tsx
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
```

- [ ] **Step 2: Update polling to capture rejection reason**

Replace lines 38-39 in the polling callback with:

```typescript
            if (data.status === 'approved' || data.status === 'rejected') {
              setStatus(data.status);
              if (data.status === 'rejected' && data.rejection_reason) {
                setRejectionReason(data.rejection_reason);
              }
```

- [ ] **Step 3: Update the rejection screen to show the reason**

Replace lines 117-129 with:

```tsx
  if (status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">No apto</h2>
          <p className="text-slate-600 mt-2">
            {rejectionReason || 'En este momento no cumples con la totalidad del perfil requerido para participar en la APP'}
          </p>
        </div>
      </div>
    );
  }
```

- [ ] **Step 4: Verify the file compiles**

```bash
npx tsc --noEmit src/components/onboarding/onboarding-container.tsx
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/onboarding/onboarding-container.tsx
git commit -m "feat: display rejection reason to user"
```

---

### Task 8: Run Lint and Type Check

- [ ] **Step 1: Run ESLint**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: lint and typecheck corrections"
```
