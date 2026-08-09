# Contigo — Reglas de Trabajo

Monorepo de la plataforma Contigo (salud y acompañamiento para adultos mayores y extranjeros).

## Estructura

```
apps/
├── backend/   # Go 1.26, Fiber v3, Clean Architecture (domain/application/interfaces/infrastructure/pkg)
├── mobile/    # Flutter 3.35+, Material 3, Feature-First + Clean + MVVM, Riverpod 3.x
└── web/       # Next.js 14 App Router, React 18, TypeScript, Tailwind, Supabase, Radix UI
specs/         # Documentación de producto, flows, API, UI, arquitectura, navegación y reglas
```

## Regla OBLIGATORIA: Revisión antes de cada cambio

Antes de escribir cualquier código, el agente principal DEBE invocar a los agentes de revisión configurados en `.opencode/agent/`:

1. **Siempre** invocar al `arquitecto` para validar arquitectura, clean architecture y coherencia con `specs/`.
2. Invocar al dev del stack afectado:
   - Cambio en `apps/web` → `dev-frontend` (+ `dev-ux` si involucra UI/UX o diseño)
   - Cambio en `apps/backend` → `dev-backend`
   - Cambio en `apps/mobile` → `dev-flutter` (+ `dev-ux` si involucra UI/UX o diseño)
   - Cambio multi-stack → invocar todos los afectados
3. **NO editar código** hasta que el arquitecto y el dev afectado aprueben (veredicto APROBADO), o el usuario lo autorice explícitamente.
4. Si los revisores piden cambios, aplicarlos y volver a revisar antes de continuar.

## Regla OBLIGATORIA: Validación después de implementar

1. Después de implementar, invocar al agente `qa` para ejecutar tests y lint del stack afectado.
2. Si el cambio involucra auth, datos sensibles, subida de archivos, endpoints o infraestructura, invocar también al agente `hacker` para revisión de seguridad.
3. Resolver las vulnerabilidades CRÍTICAS y ALTAS antes de dar el cambio por terminado (o con autorización explícita del usuario).

## Stack por app (resumen)

| App | Stack | Comandos de verificación |
|-----|-------|--------------------------|
| `apps/web` | Next.js 14, React 18, TS, Tailwind, Radix UI, Supabase | `npm run lint`, `npm run build` |
| `apps/backend` | Go 1.26, Fiber v3, Clerk JWT, TursoDB | `go test ./...`, `make lint` |
| `apps/mobile` | Flutter 3.35+, Riverpod 3.x, go_router, Dio, Freezed | `flutter analyze`, `flutter test` |

## Skills disponibles

- Web: `apps/web/.agents/skills/` (frontend-design, next-best-practices, tailwind-css-patterns, seo, accessibility, typescript-advanced-types, vercel-*)
- Mobile: `apps/mobile/.agents/skills/` (riverpod-guide, clean-architecture, widget-rules, design-system-light/dark, theme-engine, networking, accessibility, responsive, security, testing, motion-system, decision-engine)
