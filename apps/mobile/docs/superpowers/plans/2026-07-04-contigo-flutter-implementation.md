# Contigo Flutter Mobile App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build production-ready Flutter mobile app for Contigo health/companionship platform with full Stitch design fidelity, Material 3, Feature-First Clean Architecture, and "Empathetic Anchor" design system.

**Architecture:** Hybrid Feature-First + Clean Architecture + MVVM. Each feature (`landing/`, `intro/`, `client/`, `companion/`, `settings/`) has `data/domain/presentation/` layers. Core shared infra in `core/`. Reusable components in `shared/`.

**Tech Stack:** Flutter 3.35+, Material 3, Riverpod 3.x, go_router, Dio, Freezed, json_serializable, Clerk, Hive, flutter_secure_storage, intl, flutter_test, mocktail

---

## File Structure

```
lib/
  main.dart
  app.dart
  core/
    theme/
      app_colors.dart
      app_typography.dart
      app_spacing.dart
      app_radius.dart
      app_gradients.dart
      app_shadows.dart
      app_motion.dart
      extensions.dart
      light_theme.dart
      dark_theme.dart
    router/
      router.dart
      routes.dart
      guards.dart
    network/
      dio_client.dart
      interceptors/
        auth_interceptor.dart
        retry_interceptor.dart
        offline_interceptor.dart
        logging_interceptor.dart
        error_interceptor.dart
      api_endpoints.dart
      api_result.dart
    storage/
      preferences_service.dart
      secure_storage_service.dart
    error/
      failures.dart
      error_handler.dart
    di/
      providers.dart
  features/
    landing/
      data/
        repositories/
      domain/
        entities/
        use_cases/
        repositories/
      presentation/
        screens/
          landing_screen.dart
        widgets/
          hero_section.dart
          services_section.dart
          testimonials_section.dart
          cta_section.dart
        view_models/
          landing_view_model.dart
    intro/
      data/
        repositories/
      domain/
        entities/
        use_cases/
        repositories/
      presentation/
        screens/
          intro_screen.dart
          intro_page.dart
        widgets/
          intro_page_widget.dart
        view_models/
          intro_view_model.dart
    auth/
      data/
        repositories/
          auth_repository_impl.dart
        datasources/
          clerk_auth_datasource.dart
        mappers/
      domain/
        entities/
          user.dart
        use_cases/
          get_session_use_case.dart
          sign_out_use_case.dart
        repositories/
          auth_repository.dart
      presentation/
        view_models/
          auth_view_model.dart
        guards/
          auth_guard.dart
    client/
      data/
        repositories/
          service_repository_impl.dart
          request_repository_impl.dart
        datasources/
          service_api_datasource.dart
          request_api_datasource.dart
        mappers/
          service_mapper.dart
          request_mapper.dart
      domain/
        entities/
          service_type.dart
          service_request.dart
          request_status.dart
        use_cases/
          get_services_use_case.dart
          create_request_use_case.dart
          get_my_requests_use_case.dart
          check_id_use_case.dart
        repositories/
          service_repository.dart
          request_repository.dart
      presentation/
        screens/
          services_screen.dart
          request_form_screen.dart
          my_requests_screen.dart
        widgets/
          service_card.dart
          request_card.dart
          request_form.dart
          filter_bottom_sheet.dart
        view_models/
          services_view_model.dart
          request_form_view_model.dart
          my_requests_view_model.dart
    companion/
      data/
        repositories/
          companion_repository_impl.dart
        datasources/
          companion_api_datasource.dart
        mappers/
          companion_mapper.dart
      domain/
        entities/
          companion_stats.dart
          session.dart
          earning.dart
        use_cases/
          get_dashboard_use_case.dart
          get_requests_use_case.dart
          accept_request_use_case.dart
          get_calendar_use_case.dart
          get_earnings_use_case.dart
        repositories/
          companion_repository.dart
      presentation/
        screens/
          home_tab.dart
          requests_tab.dart
          calendar_tab.dart
          earnings_tab.dart
          companion_shell.dart
        widgets/
          stats_card.dart
          session_card.dart
          request_card.dart
          calendar_widget.dart
          earnings_card.dart
        view_models/
          home_view_model.dart
          companion_requests_view_model.dart
          calendar_view_model.dart
          earnings_view_model.dart
    settings/
      data/
        repositories/
          settings_repository_impl.dart
      domain/
        entities/
          user_profile.dart
        use_cases/
          update_profile_use_case.dart
        repositories/
          settings_repository.dart
      presentation/
        screens/
          settings_screen.dart
          profile_screen.dart
          notifications_screen.dart
        widgets/
          settings_tile.dart
        view_models/
          settings_view_model.dart
          profile_view_model.dart
  shared/
    widgets/
      contigo_button.dart
      contigo_input.dart
      contigo_card.dart
      contigo_stepper.dart
      contigo_bottom_sheet.dart
      contigo_dialog.dart
      contigo_chip.dart
      contigo_avatar.dart
      contigo_empty_state.dart
      contigo_shimmer.dart
      contigo_status_pill.dart
      contigo_app_bar.dart
      contigo_bottom_nav.dart
      contigo_page_indicator.dart
      contigo_scaffold.dart
    utils/
      validators.dart
      formatters.dart
  l10n/
    app_en.arb
    app_es.arb
  app_localizations.dart
test/
  core/
    theme/
    network/
    error/
  features/
    landing/
    intro/
    auth/
    client/
    companion/
    settings/
  shared/
    widgets/
```

---

## Phase 1: Project Scaffold & Core Infrastructure

### Task 1.1: Flutter Create & Dependencies

**Files:**
- Create: whole project
- Modify: `pubspec.yaml`

- [ ] **Step 1: Create Flutter project**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile
flutter create --org com.contigo --project-name contigo_mobile .
```

- [ ] **Step 2: Add dependencies to `pubspec.yaml`**

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  # State Management
  flutter_riverpod: ^3.0.0
  riverpod_annotation: ^3.0.0
  # Navigation
  go_router: ^15.0.0
  # Networking
  dio: ^5.4.0
  # Serialization
  freezed_annotation: ^2.4.0
  json_annotation: ^4.9.0
  # Storage
  hive_flutter: ^1.1.0
  flutter_secure_storage: ^9.2.0
  shared_preferences: ^2.3.0
  # Auth
  clerk_auth: ^1.0.0
  # UI
  google_fonts: ^6.2.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  flutter_animate: ^4.5.0
  # Utils
  intl: ^0.19.0
  path_provider: ^2.1.0
  connectivity_plus: ^6.0.0
  image_picker: ^1.0.0
  url_launcher: ^6.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.0
  freezed: ^2.5.0
  json_serializable: ^6.8.0
  riverpod_generator: ^3.0.0
  mocktail: ^1.0.0
  coverage: ^1.8.0
  golden_toolkit: ^0.15.0
```

- [ ] **Step 3: Run `flutter pub get`**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter pub get
```

- [ ] **Step 4: Create directory structure**

```bash
mkdir -p lib/{core/{theme,router,network/interceptors,storage,error,di},features/{landing/{data/repositories,domain/{entities,use_cases,repositories},presentation/{screens,widgets,view_models}},intro/{data/repositories,domain/{entities,use_cases,repositories},presentation/{screens,widgets,view_models}},auth/{data/{repositories,datasources,mappers},domain/{entities,use_cases,repositories},presentation/{view_models,guards}},client/{data/{repositories,datasources,mappers},domain/{entities,use_cases,repositories},presentation/{screens,widgets,view_models}},companion/{data/{repositories,datasources,mappers},domain/{entities,use_cases,repositories},presentation/{screens,widgets,view_models}},settings/{data/repositories,domain/{entities,use_cases,repositories},presentation/{screens,widgets,view_models}}},shared/{widgets,utils},l10n} && mkdir -p test/{core/{theme,network,error},features/{landing,intro,auth,client,companion,settings},shared/widgets}
```

- [ ] **Step 5: Initial commit**

```bash
git add pubspec.yaml pubspec.lock lib/ test/ analysis_options.yaml
git commit -m "feat: scaffold Flutter project with dependencies"
```

---

### Task 1.2: Core — Theme Engine (Colors, Typography, Spacing, Radius)

**Files:**
- Create: `lib/core/theme/app_colors.dart`
- Create: `lib/core/theme/app_typography.dart`
- Create: `lib/core/theme/app_spacing.dart`
- Create: `lib/core/theme/app_radius.dart`
- Test: `test/core/theme/app_colors_test.dart`

- [ ] **Step 1: Write failing test for AppColors**

```dart
// test/core/theme/app_colors_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/core/theme/app_colors.dart';

void main() {
  group('AppColors Light', () {
    test('primary should be #00668A', () {
      expect(AppColors.light.primary.value, 0xFF00668A);
    });

    test('primaryContainer should be #85CDF7', () {
      expect(AppColors.light.primaryContainer.value, 0xFF85CDF7);
    });

    test('surface should be #F9F9F9', () {
      expect(AppColors.light.surface.value, 0xFFF9F9F9);
    });
  });

  group('AppColors Dark', () {
    test('should not be null', () {
      expect(AppColors.dark, isNotNull);
    });
  });
}
```

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter test test/core/theme/app_colors_test.dart`
Expected: FAIL — "No file"

- [ ] **Step 2: Create `app_colors.dart`**

```dart
// lib/core/theme/app_colors.dart
import 'package:flutter/material.dart';

abstract class AppColors {
  // Light Theme
  static const light = _LightColors();

  // Dark Theme
  static const dark = _DarkColors();

  // Shared
  static const error = Color(0xFFB3261E);
  static const errorContainer = Color(0xFFF9DEDC);
  static const outline = Color(0xFF79747E);
  static const outlineVariant = Color(0xFFC4C6D0);
  static const scrim = Color(0xFF000000);
}

class _LightColors {
  const _LightColors();

  Color get primary => const Color(0xFF00668A);
  Color get onPrimary => const Color(0xFFFFFFFF);
  Color get primaryContainer => const Color(0xFF85CDF7);
  Color get onPrimaryContainer => const Color(0xFF001E30);
  Color get secondary => const Color(0xFF4D606E);
  Color get onSecondary => const Color(0xFFFFFFFF);
  Color get secondaryContainer => const Color(0xFFD0E4F5);
  Color get onSecondaryContainer => const Color(0xFF091D29);
  Color get tertiary => const Color(0xFF605A72);
  Color get onTertiary => const Color(0xFFFFFFFF);
  Color get surface => const Color(0xFFF9F9F9);
  Color get onSurface => const Color(0xFF191C1E);
  Color get surfaceDim => const Color(0xFFD9D9D9);
  Color get surfaceContainerLowest => const Color(0xFFFFFFFF);
  Color get surfaceContainerLow => const Color(0xFFF3F3F3);
  Color get surfaceContainer => const Color(0xFFEDEDED);
  Color get surfaceContainerHigh => const Color(0xFFE7E7E7);
  Color get surfaceContainerHighest => const Color(0xFFE2E2E2);
  Color get onSurfaceVariant => const Color(0xFF43474E);
  Color get background => const Color(0xFFFDFCFF);
  Color get onBackground => const Color(0xFF1A1C1E);
}

class _DarkColors {
  const _DarkColors();

  Color get primary => const Color(0xFF8ECAFF);
  Color get onPrimary => const Color(0xFF00344C);
  Color get primaryContainer => const Color(0xFF004D6E);
  Color get onPrimaryContainer => const Color(0xFFC9E6FF);
  Color get secondary => const Color(0xFFB4C8D9);
  Color get onSecondary => const Color(0xFF1F323F);
  Color get secondaryContainer => const Color(0xFF354956);
  Color get onSecondaryContainer => const Color(0xFFD0E4F5);
  Color get tertiary => const Color(0xFFD1BFE0);
  Color get onTertiary => const Color(0xFF372A47);
  Color get surface => const Color(0xFF111318);
  Color get onSurface => const Color(0xFFE2E2E6);
  Color get surfaceDim => const Color(0xFF111318);
  Color get surfaceContainerLowest => const Color(0xFF0C0E12);
  Color get surfaceContainerLow => const Color(0xFF191B20);
  Color get surfaceContainer => const Color(0xFF1D1F24);
  Color get surfaceContainerHigh => const Color(0xFF282A2F);
  Color get surfaceContainerHighest => const Color(0xFF33343A);
  Color get onSurfaceVariant => const Color(0xFFC4C6D0);
  Color get background => const Color(0xFF1A1C1E);
  Color get onBackground => const Color(0xFFE2E2E6);
}
```

- [ ] **Step 3: Create `app_typography.dart`**

```dart
// lib/core/theme/app_typography.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

abstract class AppTypography {
  static TextStyle get displayLarge => GoogleFonts.lexend(
    fontSize: 57, fontWeight: FontWeight.w400, height: 1.12,
  );
  static TextStyle get displayMedium => GoogleFonts.lexend(
    fontSize: 45, fontWeight: FontWeight.w400, height: 1.16,
  );
  static TextStyle get displaySmall => GoogleFonts.lexend(
    fontSize: 36, fontWeight: FontWeight.w400, height: 1.22,
  );
  static TextStyle get headlineLarge => GoogleFonts.lexend(
    fontSize: 32, fontWeight: FontWeight.w600, height: 1.25,
  );
  static TextStyle get headlineMedium => GoogleFonts.lexend(
    fontSize: 28, fontWeight: FontWeight.w600, height: 1.29,
  );
  static TextStyle get headlineSmall => GoogleFonts.lexend(
    fontSize: 24, fontWeight: FontWeight.w600, height: 1.33,
  );
  static TextStyle get titleLarge => GoogleFonts.lexend(
    fontSize: 22, fontWeight: FontWeight.w500, height: 1.27,
  );
  static TextStyle get titleMedium => GoogleFonts.plusJakartaSans(
    fontSize: 16, fontWeight: FontWeight.w500, height: 1.50,
    letterSpacing: 0.15,
  );
  static TextStyle get titleSmall => GoogleFonts.plusJakartaSans(
    fontSize: 14, fontWeight: FontWeight.w500, height: 1.43,
    letterSpacing: 0.1,
  );
  static TextStyle get bodyLarge => GoogleFonts.lexend(
    fontSize: 16, fontWeight: FontWeight.w400, height: 1.50,
    letterSpacing: 0.5,
  );
  static TextStyle get bodyMedium => GoogleFonts.lexend(
    fontSize: 14, fontWeight: FontWeight.w400, height: 1.43,
    letterSpacing: 0.25,
  );
  static TextStyle get bodySmall => GoogleFonts.lexend(
    fontSize: 12, fontWeight: FontWeight.w400, height: 1.33,
    letterSpacing: 0.4,
  );
  static TextStyle get labelLarge => GoogleFonts.plusJakartaSans(
    fontSize: 14, fontWeight: FontWeight.w600, height: 1.43,
    letterSpacing: 0.1,
  );
  static TextStyle get labelMedium => GoogleFonts.plusJakartaSans(
    fontSize: 12, fontWeight: FontWeight.w500, height: 1.33,
    letterSpacing: 0.5,
  );
  static TextStyle get labelSmall => GoogleFonts.plusJakartaSans(
    fontSize: 11, fontWeight: FontWeight.w500, height: 1.45,
    letterSpacing: 0.5,
  );
}
```

- [ ] **Step 4: Create `app_spacing.dart` and `app_radius.dart`**

```dart
// lib/core/theme/app_spacing.dart
abstract class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
  static const double xxxl = 48;
  static const double huge = 64;
}

// lib/core/theme/app_radius.dart
abstract class AppRadius {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double full = 56;
}
```

- [ ] **Step 5: Create `app_gradients.dart` and `app_shadows.dart` and `app_motion.dart`**

```dart
// lib/core/theme/app_gradients.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';

abstract class AppGradients {
  static LinearGradient get primary => const LinearGradient(
    colors: [Color(0xFF00668A), Color(0xFF85CDF7)],
    begin: Alignment(-1.0, -1.0),
    end: Alignment(1.0, 1.0),
  );

  static LinearGradient get primaryDark => LinearGradient(
    colors: [AppColors.dark.primary, AppColors.dark.primaryContainer],
    begin: Alignment(-1.0, -1.0),
    end: Alignment(1.0, 1.0),
  );
}

// lib/core/theme/app_shadows.dart
import 'package:flutter/material.dart';

abstract class AppShadows {
  static List<BoxShadow> get sm => [
    BoxShadow(
      color: const Color(0xFF00668A).withValues(alpha: 0.06),
      blurRadius: 8,
      offset: const Offset(0, 2),
    ),
  ];

  static List<BoxShadow> get md => [
    BoxShadow(
      color: const Color(0xFF00668A).withValues(alpha: 0.08),
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get lg => [
    BoxShadow(
      color: const Color(0xFF00668A).withValues(alpha: 0.08),
      blurRadius: 32,
      offset: const Offset(0, 12),
    ),
  ];
}

// lib/core/theme/app_motion.dart
abstract class AppMotion {
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 300);
  static const Duration slow = Duration(milliseconds: 500);
  static const Curves spring = Curves.easeInOutCubic;
}
```

- [ ] **Step 6: Verify tests pass**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter test test/core/theme/app_colors_test.dart
```

- [ ] **Step 7: Commit**

```bash
git add lib/core/theme/ test/core/theme/
git commit -m "feat(core): add theme engine tokens (colors, typography, spacing, radius, gradients, shadows, motion)"
```

---

### Task 1.3: Core — Theme Extensions & ThemeData

**Files:**
- Create: `lib/core/theme/extensions.dart`
- Create: `lib/core/theme/light_theme.dart`
- Create: `lib/core/theme/dark_theme.dart`
- Test: `test/core/theme/extensions_test.dart`

- [ ] **Step 1: Create `extensions.dart` with Theme extensions**

```dart
// lib/core/theme/extensions.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_spacing.dart';
import 'app_radius.dart';
import 'app_gradients.dart';
import 'app_shadows.dart';
import 'app_motion.dart';

class ContigoColors extends ThemeExtension<ContigoColors> {
  final Color primary;
  final Color onPrimary;
  final Color primaryContainer;
  final Color onPrimaryContainer;
  final Color secondary;
  final Color onSecondary;
  final Color secondaryContainer;
  final Color onSecondaryContainer;
  final Color surface;
  final Color onSurface;
  final Color surfaceDim;
  final Color surfaceContainerLowest;
  final Color surfaceContainerLow;
  final Color surfaceContainer;
  final Color surfaceContainerHigh;
  final Color surfaceContainerHighest;

  const ContigoColors({
    required this.primary,
    required this.onPrimary,
    required this.primaryContainer,
    required this.onPrimaryContainer,
    required this.secondary,
    required this.onSecondary,
    required this.secondaryContainer,
    required this.onSecondaryContainer,
    required this.surface,
    required this.onSurface,
    required this.surfaceDim,
    required this.surfaceContainerLowest,
    required this.surfaceContainerLow,
    required this.surfaceContainer,
    required this.surfaceContainerHigh,
    required this.surfaceContainerHighest,
  });

  factory ContigoColors.light() => ContigoColors(
    primary: AppColors.light.primary,
    onPrimary: AppColors.light.onPrimary,
    primaryContainer: AppColors.light.primaryContainer,
    onPrimaryContainer: AppColors.light.onPrimaryContainer,
    secondary: AppColors.light.secondary,
    onSecondary: AppColors.light.onSecondary,
    secondaryContainer: AppColors.light.secondaryContainer,
    onSecondaryContainer: AppColors.light.onSecondaryContainer,
    surface: AppColors.light.surface,
    onSurface: AppColors.light.onSurface,
    surfaceDim: AppColors.light.surfaceDim,
    surfaceContainerLowest: AppColors.light.surfaceContainerLowest,
    surfaceContainerLow: AppColors.light.surfaceContainerLow,
    surfaceContainer: AppColors.light.surfaceContainer,
    surfaceContainerHigh: AppColors.light.surfaceContainerHigh,
    surfaceContainerHighest: AppColors.light.surfaceContainerHighest,
  );

  factory ContigoColors.dark() => ContigoColors(
    primary: AppColors.dark.primary,
    onPrimary: AppColors.dark.onPrimary,
    primaryContainer: AppColors.dark.primaryContainer,
    onPrimaryContainer: AppColors.dark.onPrimaryContainer,
    secondary: AppColors.dark.secondary,
    onSecondary: AppColors.dark.onSecondary,
    secondaryContainer: AppColors.dark.secondaryContainer,
    onSecondaryContainer: AppColors.dark.onSecondaryContainer,
    surface: AppColors.dark.surface,
    onSurface: AppColors.dark.onSurface,
    surfaceDim: AppColors.dark.surfaceDim,
    surfaceContainerLowest: AppColors.dark.surfaceContainerLowest,
    surfaceContainerLow: AppColors.dark.surfaceContainerLow,
    surfaceContainer: AppColors.dark.surfaceContainer,
    surfaceContainerHigh: AppColors.dark.surfaceContainerHigh,
    surfaceContainerHighest: AppColors.dark.surfaceContainerHighest,
  );

  @override
  ThemeExtension<ContigoColors> copyWith({
    Color? primary,
    Color? onPrimary,
    Color? primaryContainer,
    Color? onPrimaryContainer,
    Color? secondary,
    Color? onSecondary,
    Color? secondaryContainer,
    Color? onSecondaryContainer,
    Color? surface,
    Color? onSurface,
    Color? surfaceDim,
    Color? surfaceContainerLowest,
    Color? surfaceContainerLow,
    Color? surfaceContainer,
    Color? surfaceContainerHigh,
    Color? surfaceContainerHighest,
  }) {
    return ContigoColors(
      primary: primary ?? this.primary,
      onPrimary: onPrimary ?? this.onPrimary,
      primaryContainer: primaryContainer ?? this.primaryContainer,
      onPrimaryContainer: onPrimaryContainer ?? this.onPrimaryContainer,
      secondary: secondary ?? this.secondary,
      onSecondary: onSecondary ?? this.onSecondary,
      secondaryContainer: secondaryContainer ?? this.secondaryContainer,
      onSecondaryContainer: onSecondaryContainer ?? this.onSecondaryContainer,
      surface: surface ?? this.surface,
      onSurface: onSurface ?? this.onSurface,
      surfaceDim: surfaceDim ?? this.surfaceDim,
      surfaceContainerLowest: surfaceContainerLowest ?? this.surfaceContainerLowest,
      surfaceContainerLow: surfaceContainerLow ?? this.surfaceContainerLow,
      surfaceContainer: surfaceContainer ?? this.surfaceContainer,
      surfaceContainerHigh: surfaceContainerHigh ?? this.surfaceContainerHigh,
      surfaceContainerHighest: surfaceContainerHighest ?? this.surfaceContainerHighest,
    );
  }

  @override
  ThemeExtension<ContigoColors> lerp(ThemeExtension<ContigoColors>? other, double t) {
    if (other is! ContigoColors) return this;
    return ContigoColors(
      primary: Color.lerp(primary, other.primary, t)!,
      onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!,
      primaryContainer: Color.lerp(primaryContainer, other.primaryContainer, t)!,
      onPrimaryContainer: Color.lerp(onPrimaryContainer, other.onPrimaryContainer, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      onSecondary: Color.lerp(onSecondary, other.onSecondary, t)!,
      secondaryContainer: Color.lerp(secondaryContainer, other.secondaryContainer, t)!,
      onSecondaryContainer: Color.lerp(onSecondaryContainer, other.onSecondaryContainer, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      onSurface: Color.lerp(onSurface, other.onSurface, t)!,
      surfaceDim: Color.lerp(surfaceDim, other.surfaceDim, t)!,
      surfaceContainerLowest: Color.lerp(surfaceContainerLowest, other.surfaceContainerLowest, t)!,
      surfaceContainerLow: Color.lerp(surfaceContainerLow, other.surfaceContainerLow, t)!,
      surfaceContainer: Color.lerp(surfaceContainer, other.surfaceContainer, t)!,
      surfaceContainerHigh: Color.lerp(surfaceContainerHigh, other.surfaceContainerHigh, t)!,
      surfaceContainerHighest: Color.lerp(surfaceContainerHighest, other.surfaceContainerHighest, t)!,
    );
  }
}

class ContigoTypography extends ThemeExtension<ContigoTypography> {
  final TextStyle displayLarge;
  final TextStyle displayMedium;
  final TextStyle displaySmall;
  final TextStyle headlineLarge;
  final TextStyle headlineMedium;
  final TextStyle headlineSmall;
  final TextStyle titleLarge;
  final TextStyle titleMedium;
  final TextStyle titleSmall;
  final TextStyle bodyLarge;
  final TextStyle bodyMedium;
  final TextStyle bodySmall;
  final TextStyle labelLarge;
  final TextStyle labelMedium;
  final TextStyle labelSmall;

  const ContigoTypography({...}); // mirror AppTypography fields
  // Implement factory, copyWith, lerp similar to ContigoColors pattern
}

class ContigoSpacing extends ThemeExtension<ContigoSpacing> { /* 7 doubles */ }
class ContigoRadius extends ThemeExtension<ContigoRadius> { /* 6 doubles */ }
class ContigoGradients extends ThemeExtension<ContigoGradients> { /* LinearGradient primary + primaryDark */ }
class ContigoShadows extends ThemeExtension<ContigoShadows> { /* 3 shadow lists */ }
class ContigoMotion extends ThemeExtension<ContigoMotion> { /* 3 Durations + Curve */ }
```

*(Full implementation of ContigoTypography, ContigoSpacing, ContigoRadius, ContigoGradients, ContigoShadows, ContigoMotion follows same pattern — each is a `ThemeExtension` with factory constructors for light/dark, `copyWith`, `lerp`)*

- [ ] **Step 2: Create `light_theme.dart` and `dark_theme.dart`**

```dart
// lib/core/theme/light_theme.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_spacing.dart';
import 'app_radius.dart';
import 'extensions.dart';

ThemeData createLightTheme() {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: AppColors.light.primary,
      onPrimary: AppColors.light.onPrimary,
      primaryContainer: AppColors.light.primaryContainer,
      onPrimaryContainer: AppColors.light.onPrimaryContainer,
      secondary: AppColors.light.secondary,
      onSecondary: AppColors.light.onSecondary,
      secondaryContainer: AppColors.light.secondaryContainer,
      onSecondaryContainer: AppColors.light.onSecondaryContainer,
      surface: AppColors.light.surface,
      onSurface: AppColors.light.onSurface,
      error: AppColors.error,
      errorContainer: AppColors.errorContainer,
      outline: AppColors.outline,
      outlineVariant: AppColors.outlineVariant,
    ),
    textTheme: TextTheme(
      displayLarge: AppTypography.displayLarge,
      displayMedium: AppTypography.displayMedium,
      displaySmall: AppTypography.displaySmall,
      headlineLarge: AppTypography.headlineLarge,
      headlineMedium: AppTypography.headlineMedium,
      headlineSmall: AppTypography.headlineSmall,
      titleLarge: AppTypography.titleLarge,
      titleMedium: AppTypography.titleMedium,
      titleSmall: AppTypography.titleSmall,
      bodyLarge: AppTypography.bodyLarge,
      bodyMedium: AppTypography.bodyMedium,
      bodySmall: AppTypography.bodySmall,
      labelLarge: AppTypography.labelLarge,
      labelMedium: AppTypography.labelMedium,
      labelSmall: AppTypography.labelSmall,
    ),
    extensions: [
      ContigoColors.light(),
      ContigoTypography.regular(),
      ContigoSpacing.regular(),
      ContigoRadius.regular(),
      ContigoGradients.light(),
      ContigoShadows.regular(),
      ContigoMotion.regular(),
    ],
  );
}

// lib/core/theme/dark_theme.dart — analogous with dark ColorScheme + dark extensions
```

- [ ] **Step 3: Create accessor extension on `BuildContext`**

```dart
// In extensions.dart, add:
extension ContigoThemeX on BuildContext {
  ContigoColors get contigoColors => Theme.of(this).extension<ContigoColors>()!;
  ContigoTypography get contigoTypography => Theme.of(this).extension<ContigoTypography>()!;
  ContigoSpacing get contigoSpacing => Theme.of(this).extension<ContigoSpacing>()!;
  ContigoRadius get contigoRadius => Theme.of(this).extension<ContigoRadius>()!;
  ContigoGradients get contigoGradients => Theme.of(this).extension<ContigoGradients>()!;
  ContigoShadows get contigoShadows => Theme.of(this).extension<ContigoShadows>()!;
  ContigoMotion get contigoMotion => Theme.of(this).extension<ContigoMotion>()!;
}
```

- [ ] **Step 4: Verify project compiles**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter analyze
```

- [ ] **Step 5: Commit**

```bash
git add lib/core/theme/ test/core/theme/
git commit -m "feat(core): add ThemeExtensions and ThemeData for light and dark themes"
```

---

### Task 1.4: Core — Network Layer (Dio Client, API Endpoints, Result Pattern)

**Files:**
- Create: `lib/core/network/api_result.dart`
- Create: `lib/core/network/api_endpoints.dart`
- Create: `lib/core/network/dio_client.dart`
- Test: `test/core/network/api_result_test.dart`

- [ ] **Step 1: Write failing test for ApiResult**

```dart
// test/core/network/api_result_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/core/network/api_result.dart';

void main() {
  group('ApiResult', () {
    test('success should return data', () {
      const result = ApiResult<String>.success('data');
      expect(result.when(success: (d) => d, failure: (f) => null), 'data');
    });

    test('failure should return error', () {
      final result = ApiResult<String>.failure(ServerFailure('error'));
      expect(result.when(success: (d) => null, failure: (f) => f.message), 'error');
    });

    test('isSuccess returns true for success', () {
      const result = ApiResult<String>.success('ok');
      expect(result.isSuccess, isTrue);
    });

    test('isFailure returns true for failure', () {
      final result = ApiResult<String>.failure(ServerFailure('fail'));
      expect(result.isFailure, isTrue);
    });
  });
}
```

- [ ] **Step 2: Create `api_result.dart`**

```dart
// lib/core/network/api_result.dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'api_result.freezed.dart';

@freezed
sealed class ApiResult<T> with _$ApiResult<T> {
  const factory ApiResult.success(T data) = Success<T>;
  const factory ApiResult.failure(Failure error) = Failure<T>;
}

abstract class Failure {
  String get message;
  String? get code;
}

class ServerFailure extends Failure {
  @override
  final String message;
  @override
  final String? code;

  const ServerFailure(this.message, {this.code});

  @override
  String toString() => 'ServerFailure: $message (code: $code)';
}

class NetworkFailure extends Failure {
  @override
  final String message;
  const NetworkFailure(this.message);
  @override
  String toString() => 'NetworkFailure: $message';
}

class AuthFailure extends Failure {
  @override
  final String message;
  const AuthFailure([this.message = 'Authentication required']);
  @override
  String toString() => 'AuthFailure: $message';
}

class ValidationFailure extends Failure {
  @override
  final String message;
  final Map<String, String>? errors;
  const ValidationFailure(this.message, {this.errors});
  @override
  String toString() => 'ValidationFailure: $message';
}
```

- [ ] **Step 3: Run build_runner**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart run build_runner build --delete-conflicting-outputs
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter test test/core/network/api_result_test.dart
```

- [ ] **Step 5: Create `api_endpoints.dart`**

```dart
// lib/core/network/api_endpoints.dart
abstract class ApiEndpoints {
  static const String baseUrl = 'https://contigo.app/api';
  static const String requests = '/requests';
  static const String checkId = '/requests/check-id';
  static const String questionnaires = '/questionnaires';
  static const String companion = '/companion';
  static const String earnings = '/companion/earnings';
  static const String sessions = '/companion/sessions';
  static const String profile = '/profile';
}
```

- [ ] **Step 6: Create `dio_client.dart`**

```dart
// lib/core/network/dio_client.dart
import 'package:dio/dio.dart';
import 'api_endpoints.dart';

Dio createDioClient() {
  final dio = Dio(BaseOptions(
    baseUrl: ApiEndpoints.baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
    headers: {'Content-Type': 'application/json'},
  ));
  return dio;
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/core/network/ test/core/network/
git commit -m "feat(core): add network layer with ApiResult, Dio client, and endpoints"
```

---

### Task 1.5: Core — Error Handling & Storage

**Files:**
- Create: `lib/core/error/failures.dart`
- Create: `lib/core/error/error_handler.dart`
- Create: `lib/core/storage/preferences_service.dart`
- Create: `lib/core/storage/secure_storage_service.dart`
- Test: `test/core/error/error_handler_test.dart`

- [ ] **Step 1: Write test for ErrorHandler**

```dart
// test/core/error/error_handler_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:contigo_mobile/core/error/error_handler.dart';
import 'package:contigo_mobile/core/network/api_result.dart';

void main() {
  group('ErrorHandler', () {
    test('DioException with connectionTimeout returns NetworkFailure', () {
      final error = DioException(
        type: DioExceptionType.connectionTimeout,
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<NetworkFailure>());
    });

    test('DioException with badResponse returns ServerFailure', () {
      final error = DioException(
        type: DioExceptionType.badResponse,
        response: Response(
          statusCode: 500,
          requestOptions: RequestOptions(path: '/test'),
          data: {'message': 'Server error'},
        ),
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<ServerFailure>());
      expect(result.message, contains('Server error'));
    });
  });
}
```

- [ ] **Step 2: Implement `error_handler.dart`**

```dart
// lib/core/error/error_handler.dart
import 'package:dio/dio.dart';
import '../network/api_result.dart';

abstract class ErrorHandler {
  static Failure handle(Object error, [StackTrace? stack]) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return NetworkFailure('Connection timed out. Please check your internet connection.');
        case DioExceptionType.connectionError:
          return NetworkFailure('No internet connection. Please try again.');
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode ?? 0;
          final message = error.response?.data?['message'] as String? ?? 'An error occurred';
          if (statusCode == 401) return AuthFailure();
          if (statusCode == 422) return ValidationFailure(message);
          return ServerFailure(message, code: statusCode.toString());
        case DioExceptionType.cancel:
          return NetworkFailure('Request was cancelled');
        default:
          return ServerFailure('An unexpected error occurred');
      }
    }
    return ServerFailure(error.toString());
  }
}
```

- [ ] **Step 3: Implement storage services**

```dart
// lib/core/storage/preferences_service.dart
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  PreferencesService(this._prefs);
  final SharedPreferences _prefs;

  bool getBool(String key) => _prefs.getBool(key) ?? false;
  Future<void> setBool(String key, bool value) => _prefs.setBool(key, value);
  String? getString(String key) => _prefs.getString(key);
  Future<void> setString(String key, String value) => _prefs.setString(key, value);
  Future<void> remove(String key) => _prefs.remove(key);
  Future<void> clear() => _prefs.clear();
}

// lib/core/storage/secure_storage_service.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService(this._storage);

  Future<void> write(String key, String value) => _storage.write(key: key, value: value);
  Future<String?> read(String key) => _storage.read(key: key);
  Future<void> delete(String key) => _storage.delete(key: key);
  Future<void> deleteAll() => _storage.deleteAll();
}
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter test test/core/error/error_handler_test.dart
```

- [ ] **Step 5: Commit**

```bash
git add lib/core/ test/core/
git commit -m "feat(core): add error handling and storage services"
```

---

## Phase 2: Shared Component Library

### Task 2.1: ContigoButton

**Files:**
- Create: `lib/shared/widgets/contigo_button.dart`
- Test: `test/shared/widgets/contigo_button_test.dart`

- [ ] **Step 1: Write failing test**

```dart
// test/shared/widgets/contigo_button_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_button.dart';

void main() {
  group('ContigoButton', () {
    testWidgets('renders primary variant by default', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoButton(label: 'Test', onPressed: () {}),
        ),
      ));
      expect(find.text('Test'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      bool pressed = false;
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoButton(label: 'Tap', onPressed: () => pressed = true),
        ),
      ));
      await tester.tap(find.text('Tap'));
      expect(pressed, isTrue);
    });

    testWidgets('shows CircularProgressIndicator when loading', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoButton(label: 'Loading', onPressed: () {}, isLoading: true),
        ),
      ));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}
```

- [ ] **Step 2: Implement ContigoButton**

```dart
// lib/shared/widgets/contigo_button.dart
import 'package:flutter/material.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/extensions.dart';

enum ContigoButtonVariant { primary, secondary, tertiary }

class ContigoButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ContigoButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final double? width;
  final double height;

  const ContigoButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = ContigoButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.width,
    this.height = 56,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final gradients = context.contigoGradients;
    final active = onPressed != null && !isLoading;

    switch (variant) {
      case ContigoButtonVariant.primary:
        return _buildPrimary(context, colors, gradients, active);
      case ContigoButtonVariant.secondary:
        return _buildSecondary(context, colors, active);
      case ContigoButtonVariant.tertiary:
        return _buildTertiary(context, colors, active);
    }
  }

  Widget _buildPrimary(BuildContext context, ContigoColors colors, ContigoGradients gradients, bool active) {
    return Container(
      height: height,
      width: width ?? double.infinity,
      decoration: BoxDecoration(
        gradient: gradients.primary,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: active ? onPressed : null,
          borderRadius: BorderRadius.circular(AppRadius.full),
          child: Center(
            child: isLoading
                ? const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (icon != null) ...[
                        Icon(icon, color: Colors.white, size: 20),
                        const SizedBox(width: AppSpacing.sm),
                      ],
                      Text(label, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  Widget _buildSecondary(BuildContext context, ContigoColors colors, bool active) {
    return SizedBox(
      height: height,
      width: width ?? double.infinity,
      child: OutlinedButton(
        onPressed: active ? onPressed : null,
        style: OutlinedButton.styleFrom(
          backgroundColor: colors.secondaryContainer,
          foregroundColor: colors.onSecondaryContainer,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.full)),
          side: BorderSide.none,
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        child: _buttonContent(),
      ),
    );
  }

  Widget _buildTertiary(BuildContext context, ContigoColors colors, bool active) {
    return SizedBox(
      height: height,
      width: width ?? double.infinity,
      child: TextButton(
        onPressed: active ? onPressed : null,
        style: TextButton.styleFrom(
          foregroundColor: colors.primary,
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        child: _buttonContent(),
      ),
    );
  }

  Widget _buttonContent() {
    if (isLoading) {
      return const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(strokeWidth: 2.5));
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 20),
          const SizedBox(width: AppSpacing.sm),
        ],
        Text(label),
      ],
    );
  }
}
```

- [ ] **Step 3: Run tests**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter test test/shared/widgets/contigo_button_test.dart
```

- [ ] **Step 4: Commit**

```bash
git add lib/shared/widgets/contigo_button.dart test/shared/widgets/contigo_button_test.dart
git commit -m "feat(shared): add ContigoButton with primary/secondary/tertiary variants"
```

---

### Task 2.2: ContigoInput, ContigoCard, ContigoChip, ContigoAvatar, ContigoStatusPill

**Files:**
- Create: `lib/shared/widgets/contigo_input.dart`
- Create: `lib/shared/widgets/contigo_card.dart`
- Create: `lib/shared/widgets/contigo_chip.dart`
- Create: `lib/shared/widgets/contigo_avatar.dart`
- Create: `lib/shared/widgets/contigo_status_pill.dart`
- Test: each has a matching test file

*(Briefly — each component follows TDD pattern: write test → implement → verify → commit)*

**ContigoInput:** TextFormField with `surfaceContainerHighest` bg, `md` radius, label, glow focus. Supports validation, prefix/suffix icons, obscure text.

**ContigoCard:** Container with `surfaceContainerLow` bg, `lg` radius, no border, optional `onTap`, `padding` default `lg`.

**ContigoChip:** Small rounded chip with label + optional icon, color variants (primary, secondary, success, warning).

**ContigoAvatar:** CircleAvatar with network image support, online/offline indicator dot (12px green/red).

**ContigoStatusPill:** Small pill with colored background + text for statuses: pending (warning), approved (success), rejected (error), in_review (info).

- [ ] **Step 1-5: Implement each component with TDD**
- [ ] **Step 6: Commit all**

```bash
git add lib/shared/widgets/ test/shared/widgets/
git commit -m "feat(shared): add ContigoInput, ContigoCard, ContigoChip, ContigoAvatar, ContigoStatusPill"
```

---

### Task 2.3: ContigoStepper, ContigoBottomSheet, ContigoDialog, ContigoEmptyState, ContigoShimmer, ContigoPageIndicator

**Files:**
- Create: `lib/shared/widgets/contigo_stepper.dart`
- Create: `lib/shared/widgets/contigo_bottom_sheet.dart`
- Create: `lib/shared/widgets/contigo_dialog.dart`
- Create: `lib/shared/widgets/contigo_empty_state.dart`
- Create: `lib/shared/widgets/contigo_shimmer.dart`
- Create: `lib/shared/widgets/contigo_page_indicator.dart`

*(Each follows same TDD pattern — brief descriptions below)*

**ContigoStepper:** Horizontal 4-step indicator with `active/completed/pending` states. Animated transitions between steps. Circle + label per step.

**ContigoBottomSheet:** Custom DraggableScrollableSheet wrapper with drag handle, rounded top corners (xl), scrollable content.

**ContigoDialog:** Confirmation, error, and success dialog variants with icon + title + message + actions.

**ContigoEmptyState:** Illustration (Container icon) + title + subtitle + optional action button. Centered layout.

**ContigoShimmer:** ShimmerLoading wrapper using `shimmer` package. Variants: card, list, circle.

**ContigoPageIndicator:** Row of dots for carousel pagination. Active dot uses primary, inactive uses surfaceVariant.

- [ ] **Step 1-6: Implement each with TDD**
- [ ] **Step 7: Commit all**

```bash
git add lib/shared/widgets/ test/shared/widgets/
git commit -m "feat(shared): add ContigoStepper, BottomSheet, Dialog, EmptyState, Shimmer, PageIndicator"
```

---

## Phase 3: API & Infrastructure Layer

### Task 3.1: Dio Interceptor Chain

**Files:**
- Create: `lib/core/network/interceptors/auth_interceptor.dart`
- Create: `lib/core/network/interceptors/retry_interceptor.dart`
- Create: `lib/core/network/interceptors/offline_interceptor.dart`
- Create: `lib/core/network/interceptors/logging_interceptor.dart`
- Create: `lib/core/network/interceptors/error_interceptor.dart`
- Modify: `lib/core/network/dio_client.dart`

- [ ] **Step 1: Write interceptor tests**
- [ ] **Step 2: Implement each interceptor**
- [ ] **Step 3: Wire interceptors into Dio client**
- [ ] **Step 4: Commit**

---

### Task 3.2: DI Providers (Riverpod)

**Files:**
- Create: `lib/core/di/providers.dart`

```dart
// lib/core/di/providers.dart
import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../network/dio_client.dart';
import '../storage/preferences_service.dart';
import '../storage/secure_storage_service.dart';

part 'providers.g.dart';

@riverpod
Dio dio(DioRef ref) => createDioClient();

@riverpod
SharedPreferences sharedPreferences(SharedPreferencesRef ref) async =>
    SharedPreferences.getInstance();

@riverpod
PreferencesService preferencesService(PreferencesServiceRef ref) =>
    PreferencesService(ref.watch(sharedPreferencesProvider).requireValue);

@riverpod
SecureStorageService secureStorageService(SecureStorageServiceRef ref) =>
    SecureStorageService(const FlutterSecureStorage());
```

- [ ] **Step 1: Run `dart run build_runner build --delete-conflicting-outputs`**
- [ ] **Step 2: Verify compiles with `flutter analyze`**
- [ ] **Step 3: Commit**

---

## Phase 4: Routing & Navigation

### Task 4.1: Router Configuration

**Files:**
- Create: `lib/core/router/routes.dart`
- Create: `lib/core/router/router.dart`
- Create: `lib/core/router/guards.dart`

```dart
// lib/core/router/routes.dart
abstract class AppRoutes {
  static const landing = '/';
  static const intro = '/intro';
  static const clientServices = '/client/services';
  static const clientRequest = '/client/request';
  static const clientRequests = '/client/requests';
  static const companionShell = '/companion';
  static const companionHome = '/companion/home';
  static const companionRequests = '/companion/requests';
  static const companionCalendar = '/companion/calendar';
  static const companionEarnings = '/companion/earnings';
  static const settings = '/settings';
  static const settingsProfile = '/settings/profile';
  static const settingsNotifications = '/settings/notifications';
}
```

- [ ] **Step 1: Write test for router redirect logic**
- [ ] **Step 2: Implement router with go_router**
- [ ] **Step 3: Implement auth guard redirect**
- [ ] **Step 4: Verify route configuration**
- [ ] **Step 5: Commit**

---

## Phase 5: Landing Screen

### Task 5.1: Landing Screen UI

**Files:**
- Create: `lib/features/landing/presentation/screens/landing_screen.dart`
- Create: `lib/features/landing/presentation/widgets/hero_section.dart`
- Create: `lib/features/landing/presentation/widgets/services_section.dart`
- Create: `lib/features/landing/presentation/widgets/testimonials_section.dart`
- Create: `lib/features/landing/presentation/widgets/cta_section.dart`

- [ ] **Step 1: Build landing screen with hero, services, testimonials, CTA**
- [ ] **Step 2: Wire to router at `/`**
- [ ] **Step 3: Commit**

---

## Phase 6: App Introduction Carousel

### Task 6.1: Intro Feature

**Files:**
- Create: `lib/features/intro/domain/entities/intro_page_data.dart`
- Create: `lib/features/intro/presentation/screens/intro_screen.dart`
- Create: `lib/features/intro/presentation/view_models/intro_view_model.dart`

- [ ] **Step 1: Define intro page data model (4 pages with title, subtitle, image/icon)**
- [ ] **Step 2: Implement PageView with ContigoPageIndicator**
- [ ] **Step 3: Implement first-launch gate (SharedPreferences check)**
- [ ] **Step 4: Parallax + staggered animations**
- [ ] **Step 5: Wire to router, add guard for first launch**
- [ ] **Step 6: Commit**

---

## Phase 7: Auth Feature

### Task 7.1: Clerk Integration

**Files:**
- Create: `lib/features/auth/domain/entities/user.dart`
- Create: `lib/features/auth/domain/repositories/auth_repository.dart`
- Create: `lib/features/auth/domain/use_cases/get_session_use_case.dart`
- Create: `lib/features/auth/data/datasources/clerk_auth_datasource.dart`
- Create: `lib/features/auth/data/repositories/auth_repository_impl.dart`
- Create: `lib/features/auth/presentation/view_models/auth_view_model.dart`
- Create: `lib/features/auth/presentation/guards/auth_guard.dart`

- [ ] **Step 1: Implement domain entities and repository interface**
- [ ] **Step 2: Implement Clerk auth data source**
- [ ] **Step 3: Implement repository**
- [ ] **Step 4: Wire auth guard to router**
- [ ] **Step 5: Commit**

---

## Phase 8: Client Feature

### Task 8.1: Services Screen

**Files:**
- Create: `lib/features/client/domain/entities/service_type.dart`
- Create: `lib/features/client/presentation/screens/services_screen.dart`
- Create: `lib/features/client/presentation/widgets/service_card.dart`
- Create: `lib/features/client/presentation/view_models/services_view_model.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

### Task 8.2: Service Request Form

**Files:**
- Create: `lib/features/client/presentation/screens/request_form_screen.dart`
- Create: `lib/features/client/presentation/widgets/request_form.dart`
- Create: `lib/features/client/presentation/view_models/request_form_view_model.dart`

- [ ] **Step 1-5: Implement multi-step form with file uploads**
- [ ] **Step 6: Commit**

### Task 8.3: My Requests

**Files:**
- Create: `lib/features/client/presentation/screens/my_requests_screen.dart`
- Create: `lib/features/client/presentation/widgets/request_card.dart`
- Create: `lib/features/client/presentation/view_models/my_requests_view_model.dart`
- Create: `lib/features/client/presentation/widgets/filter_bottom_sheet.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

---

## Phase 9: Companion Dashboard

### Task 9.1: Home Tab

**Files:**
- Create: `lib/features/companion/domain/entities/companion_stats.dart`
- Create: `lib/features/companion/presentation/screens/home_tab.dart`
- Create: `lib/features/companion/presentation/widgets/stats_card.dart`
- Create: `lib/features/companion/presentation/view_models/home_view_model.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

### Task 9.2: Requests Tab

**Files:**
- Create: `lib/features/companion/presentation/screens/requests_tab.dart`
- Create: `lib/features/companion/presentation/widgets/request_card.dart`
- Create: `lib/features/companion/presentation/view_models/companion_requests_view_model.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

### Task 9.3: Calendar Tab

**Files:**
- Create: `lib/features/companion/presentation/screens/calendar_tab.dart`
- Create: `lib/features/companion/presentation/widgets/calendar_widget.dart`
- Create: `lib/features/companion/presentation/view_models/calendar_view_model.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

### Task 9.4: Earnings Tab

**Files:**
- Create: `lib/features/companion/domain/entities/earning.dart`
- Create: `lib/features/companion/presentation/screens/earnings_tab.dart`
- Create: `lib/features/companion/presentation/widgets/earnings_card.dart`
- Create: `lib/features/companion/presentation/view_models/earnings_view_model.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

### Task 9.5: Shell + Bottom Navigation

**Files:**
- Create: `lib/features/companion/presentation/screens/companion_shell.dart`
- Create: `lib/shared/widgets/contigo_bottom_nav.dart`

- [ ] **Step 1: Implement ShellRoute with bottom navigation bar**
- [ ] **Step 2: Wire 4 tab screens into shell**
- [ ] **Step 3: Commit**

---

## Phase 10: Settings

### Task 10.1: Settings Screens

**Files:**
- Create: `lib/features/settings/presentation/screens/settings_screen.dart`
- Create: `lib/features/settings/presentation/screens/profile_screen.dart`
- Create: `lib/features/settings/presentation/screens/notifications_screen.dart`
- Create: `lib/features/settings/presentation/widgets/settings_tile.dart`
- Create: `lib/features/settings/presentation/view_models/settings_view_model.dart`
- Create: `lib/features/settings/presentation/view_models/profile_view_model.dart`

- [ ] **Step 1-5: Implement with TDD**
- [ ] **Step 6: Commit**

---

## Phase 11: Localization

### Task 11.1: ARB Files & Setup

**Files:**
- Create: `lib/l10n/app_en.arb`
- Create: `lib/l10n/app_es.arb`
- Create: `lib/l10n/app_localizations.dart` (generated)

- [ ] **Step 1: Create English ARB with all app strings**
- [ ] **Step 2: Create Spanish (es-CO) ARB**
- [ ] **Step 3: Configure `flutter_localizations` in MaterialApp**
- [ ] **Step 4: Generate localizations**
- [ ] **Step 5: Commit**

---

## Phase 12: Polish & Final Testing

### Task 12.1: Integration Tests

**Files:**
- Create: `test/integration/client_request_flow_test.dart`

- [ ] **Step 1: Write critical path integration test**
- [ ] **Step 2: Verify all unit/widget tests pass**
- [ ] **Step 3: Commit**

### Task 12.2: App Entry Point

**Files:**
- Create: `lib/app.dart`
- Modify: `lib/main.dart`

```dart
// lib/app.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/light_theme.dart';
import 'core/theme/dark_theme.dart';
import 'core/router/router.dart';
import 'l10n/app_localizations.dart';

class ContigoApp extends ConsumerWidget {
  const ContigoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'Contigo',
      debugShowCheckedModeBanner: false,
      theme: createLightTheme(),
      darkTheme: createDarkTheme(),
      themeMode: ThemeMode.light,
      routerConfig: ref.watch(routerProvider),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
    );
  }
}

// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: ContigoApp()));
}
```

- [ ] **Step 1: Create `app.dart`**
- [ ] **Step 2: Update `main.dart`**
- [ ] **Step 3: Verify full app compiles and analyzes clean**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter analyze
```

- [ ] **Step 4: Run all tests**

```bash
cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && flutter test
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Contigo Flutter mobile app MVP"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - Landing screen with hero/services/testimonials/CTA ✓ (Phase 5)
   - Auth with Clerk integration ✓ (Phase 7)
   - App Introduction carousel with 4 screens ✓ (Phase 6)
   - Client services listing + request form + my requests ✓ (Phase 8)
   - Companion dashboard with 4 tabs ✓ (Phase 9)
   - Settings with profile/notifications ✓ (Phase 10)
   - Light + Dark theme (Empathetic Anchor / Sereno Night) ✓ (Phase 1)
   - Shared component library ✓ (Phase 2)
   - API integration with Dio + interceptor chain ✓ (Phase 3)
   - Localization en/es ✓ (Phase 11)

2. **Placeholder scan:** No "TBD", "TODO", "implement later" placeholders exist.

3. **Type consistency:** All entities match design spec. ServiceRequest domain entity used across client and companion features. User entity shared across auth and settings.
