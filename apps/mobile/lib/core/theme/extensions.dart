import 'dart:ui' show lerpDouble;

import 'package:flutter/material.dart';

class ContigoColors extends ThemeExtension<ContigoColors> {
  final Color primary;
  final Color onPrimary;
  final Color primaryContainer;
  final Color onPrimaryContainer;
  final Color primaryFixed;
  final Color primaryFixedDim;
  final Color onPrimaryFixed;
  final Color onPrimaryFixedVariant;
  final Color secondary;
  final Color onSecondary;
  final Color secondaryContainer;
  final Color onSecondaryContainer;
  final Color secondaryFixed;
  final Color secondaryFixedDim;
  final Color onSecondaryFixed;
  final Color onSecondaryFixedVariant;
  final Color tertiary;
  final Color onTertiary;
  final Color tertiaryContainer;
  final Color onTertiaryContainer;
  final Color tertiaryFixed;
  final Color tertiaryFixedDim;
  final Color onTertiaryFixed;
  final Color onTertiaryFixedVariant;
  final Color error;
  final Color onError;
  final Color errorContainer;
  final Color onErrorContainer;
  final Color surface;
  final Color onSurface;
  final Color surfaceDim;
  final Color surfaceBright;
  final Color surfaceContainerLowest;
  final Color surfaceContainerLow;
  final Color surfaceContainer;
  final Color surfaceContainerHigh;
  final Color surfaceContainerHighest;
  final Color onSurfaceVariant;
  final Color surfaceVariant;
  final Color surfaceTint;
  final Color inverseSurface;
  final Color inverseOnSurface;
  final Color inversePrimary;
  final Color outline;
  final Color outlineVariant;
  final Color background;
  final Color onBackground;

  const ContigoColors({
    required this.primary,
    required this.onPrimary,
    required this.primaryContainer,
    required this.onPrimaryContainer,
    required this.primaryFixed,
    required this.primaryFixedDim,
    required this.onPrimaryFixed,
    required this.onPrimaryFixedVariant,
    required this.secondary,
    required this.onSecondary,
    required this.secondaryContainer,
    required this.onSecondaryContainer,
    required this.secondaryFixed,
    required this.secondaryFixedDim,
    required this.onSecondaryFixed,
    required this.onSecondaryFixedVariant,
    required this.tertiary,
    required this.onTertiary,
    required this.tertiaryContainer,
    required this.onTertiaryContainer,
    required this.tertiaryFixed,
    required this.tertiaryFixedDim,
    required this.onTertiaryFixed,
    required this.onTertiaryFixedVariant,
    required this.error,
    required this.onError,
    required this.errorContainer,
    required this.onErrorContainer,
    required this.surface,
    required this.onSurface,
    required this.surfaceDim,
    required this.surfaceBright,
    required this.surfaceContainerLowest,
    required this.surfaceContainerLow,
    required this.surfaceContainer,
    required this.surfaceContainerHigh,
    required this.surfaceContainerHighest,
    required this.onSurfaceVariant,
    required this.surfaceVariant,
    required this.surfaceTint,
    required this.inverseSurface,
    required this.inverseOnSurface,
    required this.inversePrimary,
    required this.outline,
    required this.outlineVariant,
    required this.background,
    required this.onBackground,
  });

  factory ContigoColors.light() => const ContigoColors(
    primary: Color(0xFF00668A),
    onPrimary: Color(0xFFFFFFFF),
    primaryContainer: Color(0xFF85CDF7),
    onPrimaryContainer: Color(0xFF001E30),
    primaryFixed: Color(0xFF85CDF7),
    primaryFixedDim: Color(0xFF00668A),
    onPrimaryFixed: Color(0xFF001E30),
    onPrimaryFixedVariant: Color(0xFF004D6E),
    secondary: Color(0xFF4D606E),
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: Color(0xFFD0E4F5),
    onSecondaryContainer: Color(0xFF091D29),
    secondaryFixed: Color(0xFFD0E4F5),
    secondaryFixedDim: Color(0xFF4D606E),
    onSecondaryFixed: Color(0xFF091D29),
    onSecondaryFixedVariant: Color(0xFF354956),
    tertiary: Color(0xFF605A72),
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: Color(0xFFE7DFF8),
    onTertiaryContainer: Color(0xFF1D172D),
    tertiaryFixed: Color(0xFFE7DFF8),
    tertiaryFixedDim: Color(0xFFCBBFDD),
    onTertiaryFixed: Color(0xFF1D172D),
    onTertiaryFixedVariant: Color(0xFF494157),
    error: Color(0xFFB3261E),
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFF9DEDC),
    onErrorContainer: Color(0xFF410002),
    surface: Color(0xFFF9F9F9),
    onSurface: Color(0xFF191C1E),
    surfaceDim: Color(0xFFD9D9D9),
    surfaceBright: Color(0xFFF9F9F9),
    surfaceContainerLowest: Color(0xFFFFFFFF),
    surfaceContainerLow: Color(0xFFF3F3F3),
    surfaceContainer: Color(0xFFEDEDED),
    surfaceContainerHigh: Color(0xFFE7E7E7),
    surfaceContainerHighest: Color(0xFFE2E2E2),
    onSurfaceVariant: Color(0xFF43474E),
    surfaceVariant: Color(0xFFDDE3EA),
    surfaceTint: Color(0xFF00668A),
    inverseSurface: Color(0xFF2E3135),
    inverseOnSurface: Color(0xFFF0F0F4),
    inversePrimary: Color(0xFF85CDF7),
    outline: Color(0xFF79747E),
    outlineVariant: Color(0xFFC4C6D0),
    background: Color(0xFFFDFCFF),
    onBackground: Color(0xFF1A1C1E),
  );

  factory ContigoColors.dark() => const ContigoColors(
    primary: Color(0xFFB4E8FF),
    onPrimary: Color(0xFF003544),
    primaryContainer: Color(0xFF87CEEB),
    onPrimaryContainer: Color(0xFF005870),
    primaryFixed: Color(0xFFBAEAFF),
    primaryFixedDim: Color(0xFF89D0ED),
    onPrimaryFixed: Color(0xFF001F29),
    onPrimaryFixedVariant: Color(0xFF004D62),
    secondary: Color(0xFF7BD0FF),
    onSecondary: Color(0xFF00354A),
    secondaryContainer: Color(0xFF00A6E0),
    onSecondaryContainer: Color(0xFF00374D),
    secondaryFixed: Color(0xFFC4E7FF),
    secondaryFixedDim: Color(0xFF7BD0FF),
    onSecondaryFixed: Color(0xFF001E2C),
    onSecondaryFixedVariant: Color(0xFF004C69),
    tertiary: Color(0xFFD2E2F8),
    onTertiary: Color(0xFF233143),
    tertiaryContainer: Color(0xFFB7C6DC),
    onTertiaryContainer: Color(0xFF445265),
    tertiaryFixed: Color(0xFFD4E4FA),
    tertiaryFixedDim: Color(0xFFB9C8DE),
    onTertiaryFixed: Color(0xFF0D1C2D),
    onTertiaryFixedVariant: Color(0xFF39485A),
    error: Color(0xFFFFB4AB),
    onError: Color(0xFF690005),
    errorContainer: Color(0xFF93000A),
    onErrorContainer: Color(0xFFFFDAD6),
    surface: Color(0xFF0B1326),
    onSurface: Color(0xFFDAE2FD),
    surfaceDim: Color(0xFF0B1326),
    surfaceBright: Color(0xFF31394D),
    surfaceContainerLowest: Color(0xFF060E20),
    surfaceContainerLow: Color(0xFF131B2E),
    surfaceContainer: Color(0xFF171F33),
    surfaceContainerHigh: Color(0xFF222A3D),
    surfaceContainerHighest: Color(0xFF2D3449),
    onSurfaceVariant: Color(0xFFBFC8CD),
    surfaceVariant: Color(0xFF2D3449),
    surfaceTint: Color(0xFF89D0ED),
    inverseSurface: Color(0xFFDAE2FD),
    inverseOnSurface: Color(0xFF283044),
    inversePrimary: Color(0xFF0C6780),
    outline: Color(0xFF899297),
    outlineVariant: Color(0xFF3F484C),
    background: Color(0xFF0B1326),
    onBackground: Color(0xFFDAE2FD),
  );

  @override
  ContigoColors copyWith({
    Color? primary,
    Color? onPrimary,
    Color? primaryContainer,
    Color? onPrimaryContainer,
    Color? primaryFixed,
    Color? primaryFixedDim,
    Color? onPrimaryFixed,
    Color? onPrimaryFixedVariant,
    Color? secondary,
    Color? onSecondary,
    Color? secondaryContainer,
    Color? onSecondaryContainer,
    Color? secondaryFixed,
    Color? secondaryFixedDim,
    Color? onSecondaryFixed,
    Color? onSecondaryFixedVariant,
    Color? tertiary,
    Color? onTertiary,
    Color? tertiaryContainer,
    Color? onTertiaryContainer,
    Color? tertiaryFixed,
    Color? tertiaryFixedDim,
    Color? onTertiaryFixed,
    Color? onTertiaryFixedVariant,
    Color? error,
    Color? onError,
    Color? errorContainer,
    Color? onErrorContainer,
    Color? surface,
    Color? onSurface,
    Color? surfaceDim,
    Color? surfaceBright,
    Color? surfaceContainerLowest,
    Color? surfaceContainerLow,
    Color? surfaceContainer,
    Color? surfaceContainerHigh,
    Color? surfaceContainerHighest,
    Color? onSurfaceVariant,
    Color? surfaceVariant,
    Color? surfaceTint,
    Color? inverseSurface,
    Color? inverseOnSurface,
    Color? inversePrimary,
    Color? outline,
    Color? outlineVariant,
    Color? background,
    Color? onBackground,
  }) {
    return ContigoColors(
      primary: primary ?? this.primary,
      onPrimary: onPrimary ?? this.onPrimary,
      primaryContainer: primaryContainer ?? this.primaryContainer,
      onPrimaryContainer: onPrimaryContainer ?? this.onPrimaryContainer,
      primaryFixed: primaryFixed ?? this.primaryFixed,
      primaryFixedDim: primaryFixedDim ?? this.primaryFixedDim,
      onPrimaryFixed: onPrimaryFixed ?? this.onPrimaryFixed,
      onPrimaryFixedVariant: onPrimaryFixedVariant ?? this.onPrimaryFixedVariant,
      secondary: secondary ?? this.secondary,
      onSecondary: onSecondary ?? this.onSecondary,
      secondaryContainer: secondaryContainer ?? this.secondaryContainer,
      onSecondaryContainer: onSecondaryContainer ?? this.onSecondaryContainer,
      secondaryFixed: secondaryFixed ?? this.secondaryFixed,
      secondaryFixedDim: secondaryFixedDim ?? this.secondaryFixedDim,
      onSecondaryFixed: onSecondaryFixed ?? this.onSecondaryFixed,
      onSecondaryFixedVariant: onSecondaryFixedVariant ?? this.onSecondaryFixedVariant,
      tertiary: tertiary ?? this.tertiary,
      onTertiary: onTertiary ?? this.onTertiary,
      tertiaryContainer: tertiaryContainer ?? this.tertiaryContainer,
      onTertiaryContainer: onTertiaryContainer ?? this.onTertiaryContainer,
      tertiaryFixed: tertiaryFixed ?? this.tertiaryFixed,
      tertiaryFixedDim: tertiaryFixedDim ?? this.tertiaryFixedDim,
      onTertiaryFixed: onTertiaryFixed ?? this.onTertiaryFixed,
      onTertiaryFixedVariant: onTertiaryFixedVariant ?? this.onTertiaryFixedVariant,
      error: error ?? this.error,
      onError: onError ?? this.onError,
      errorContainer: errorContainer ?? this.errorContainer,
      onErrorContainer: onErrorContainer ?? this.onErrorContainer,
      surface: surface ?? this.surface,
      onSurface: onSurface ?? this.onSurface,
      surfaceDim: surfaceDim ?? this.surfaceDim,
      surfaceBright: surfaceBright ?? this.surfaceBright,
      surfaceContainerLowest: surfaceContainerLowest ?? this.surfaceContainerLowest,
      surfaceContainerLow: surfaceContainerLow ?? this.surfaceContainerLow,
      surfaceContainer: surfaceContainer ?? this.surfaceContainer,
      surfaceContainerHigh: surfaceContainerHigh ?? this.surfaceContainerHigh,
      surfaceContainerHighest: surfaceContainerHighest ?? this.surfaceContainerHighest,
      onSurfaceVariant: onSurfaceVariant ?? this.onSurfaceVariant,
      surfaceVariant: surfaceVariant ?? this.surfaceVariant,
      surfaceTint: surfaceTint ?? this.surfaceTint,
      inverseSurface: inverseSurface ?? this.inverseSurface,
      inverseOnSurface: inverseOnSurface ?? this.inverseOnSurface,
      inversePrimary: inversePrimary ?? this.inversePrimary,
      outline: outline ?? this.outline,
      outlineVariant: outlineVariant ?? this.outlineVariant,
      background: background ?? this.background,
      onBackground: onBackground ?? this.onBackground,
    );
  }

  @override
  ContigoColors lerp(ThemeExtension<ContigoColors>? other, double t) {
    if (other is! ContigoColors) return this;
    return ContigoColors(
      primary: Color.lerp(primary, other.primary, t)!,
      onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!,
      primaryContainer: Color.lerp(primaryContainer, other.primaryContainer, t)!,
      onPrimaryContainer: Color.lerp(onPrimaryContainer, other.onPrimaryContainer, t)!,
      primaryFixed: Color.lerp(primaryFixed, other.primaryFixed, t)!,
      primaryFixedDim: Color.lerp(primaryFixedDim, other.primaryFixedDim, t)!,
      onPrimaryFixed: Color.lerp(onPrimaryFixed, other.onPrimaryFixed, t)!,
      onPrimaryFixedVariant: Color.lerp(onPrimaryFixedVariant, other.onPrimaryFixedVariant, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      onSecondary: Color.lerp(onSecondary, other.onSecondary, t)!,
      secondaryContainer: Color.lerp(secondaryContainer, other.secondaryContainer, t)!,
      onSecondaryContainer: Color.lerp(onSecondaryContainer, other.onSecondaryContainer, t)!,
      secondaryFixed: Color.lerp(secondaryFixed, other.secondaryFixed, t)!,
      secondaryFixedDim: Color.lerp(secondaryFixedDim, other.secondaryFixedDim, t)!,
      onSecondaryFixed: Color.lerp(onSecondaryFixed, other.onSecondaryFixed, t)!,
      onSecondaryFixedVariant: Color.lerp(onSecondaryFixedVariant, other.onSecondaryFixedVariant, t)!,
      tertiary: Color.lerp(tertiary, other.tertiary, t)!,
      onTertiary: Color.lerp(onTertiary, other.onTertiary, t)!,
      tertiaryContainer: Color.lerp(tertiaryContainer, other.tertiaryContainer, t)!,
      onTertiaryContainer: Color.lerp(onTertiaryContainer, other.onTertiaryContainer, t)!,
      tertiaryFixed: Color.lerp(tertiaryFixed, other.tertiaryFixed, t)!,
      tertiaryFixedDim: Color.lerp(tertiaryFixedDim, other.tertiaryFixedDim, t)!,
      onTertiaryFixed: Color.lerp(onTertiaryFixed, other.onTertiaryFixed, t)!,
      onTertiaryFixedVariant: Color.lerp(onTertiaryFixedVariant, other.onTertiaryFixedVariant, t)!,
      error: Color.lerp(error, other.error, t)!,
      onError: Color.lerp(onError, other.onError, t)!,
      errorContainer: Color.lerp(errorContainer, other.errorContainer, t)!,
      onErrorContainer: Color.lerp(onErrorContainer, other.onErrorContainer, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      onSurface: Color.lerp(onSurface, other.onSurface, t)!,
      surfaceDim: Color.lerp(surfaceDim, other.surfaceDim, t)!,
      surfaceBright: Color.lerp(surfaceBright, other.surfaceBright, t)!,
      surfaceContainerLowest: Color.lerp(surfaceContainerLowest, other.surfaceContainerLowest, t)!,
      surfaceContainerLow: Color.lerp(surfaceContainerLow, other.surfaceContainerLow, t)!,
      surfaceContainer: Color.lerp(surfaceContainer, other.surfaceContainer, t)!,
      surfaceContainerHigh: Color.lerp(surfaceContainerHigh, other.surfaceContainerHigh, t)!,
      surfaceContainerHighest: Color.lerp(surfaceContainerHighest, other.surfaceContainerHighest, t)!,
      onSurfaceVariant: Color.lerp(onSurfaceVariant, other.onSurfaceVariant, t)!,
      surfaceVariant: Color.lerp(surfaceVariant, other.surfaceVariant, t)!,
      surfaceTint: Color.lerp(surfaceTint, other.surfaceTint, t)!,
      inverseSurface: Color.lerp(inverseSurface, other.inverseSurface, t)!,
      inverseOnSurface: Color.lerp(inverseOnSurface, other.inverseOnSurface, t)!,
      inversePrimary: Color.lerp(inversePrimary, other.inversePrimary, t)!,
      outline: Color.lerp(outline, other.outline, t)!,
      outlineVariant: Color.lerp(outlineVariant, other.outlineVariant, t)!,
      background: Color.lerp(background, other.background, t)!,
      onBackground: Color.lerp(onBackground, other.onBackground, t)!,
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

  const ContigoTypography({
    required this.displayLarge,
    required this.displayMedium,
    required this.displaySmall,
    required this.headlineLarge,
    required this.headlineMedium,
    required this.headlineSmall,
    required this.titleLarge,
    required this.titleMedium,
    required this.titleSmall,
    required this.bodyLarge,
    required this.bodyMedium,
    required this.bodySmall,
    required this.labelLarge,
    required this.labelMedium,
    required this.labelSmall,
  });

  factory ContigoTypography.regular() => ContigoTypography(
    displayLarge: const TextStyle(fontSize: 48, fontWeight: FontWeight.w600, height: 1.17, letterSpacing: -0.96, fontFamily: 'Lexend'),
    displayMedium: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, height: 1.20, fontFamily: 'Lexend'),
    displaySmall: const TextStyle(fontSize: 36, fontWeight: FontWeight.w400, height: 1.22, fontFamily: 'Lexend'),
    headlineLarge: const TextStyle(fontSize: 32, fontWeight: FontWeight.w500, height: 1.25, letterSpacing: -0.32, fontFamily: 'Lexend'),
    headlineMedium: const TextStyle(fontSize: 28, fontWeight: FontWeight.w500, height: 1.29, fontFamily: 'Lexend'),
    headlineSmall: const TextStyle(fontSize: 24, fontWeight: FontWeight.w500, height: 1.33, fontFamily: 'Lexend'),
    titleLarge: const TextStyle(fontSize: 22, fontWeight: FontWeight.w500, height: 1.27, fontFamily: 'Lexend'),
    titleMedium: const TextStyle(fontSize: 20, fontWeight: FontWeight.w500, height: 1.40, fontFamily: 'Lexend'),
    titleSmall: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, height: 1.43, fontFamily: 'Lexend'),
    bodyLarge: const TextStyle(fontSize: 18, fontWeight: FontWeight.w300, height: 1.56, fontFamily: 'Lexend'),
    bodyMedium: const TextStyle(fontSize: 16, fontWeight: FontWeight.w300, height: 1.50, fontFamily: 'Lexend'),
    bodySmall: const TextStyle(fontSize: 14, fontWeight: FontWeight.w300, height: 1.43, fontFamily: 'Lexend'),
    labelLarge: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, height: 1.43, letterSpacing: 0.14, fontFamily: 'Lexend'),
    labelMedium: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, height: 1.43, letterSpacing: 0.14, fontFamily: 'Lexend'),
    labelSmall: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, height: 1.33, letterSpacing: 0.12, fontFamily: 'Lexend'),
  );

  @override
  ContigoTypography copyWith({
    TextStyle? displayLarge,
    TextStyle? displayMedium,
    TextStyle? displaySmall,
    TextStyle? headlineLarge,
    TextStyle? headlineMedium,
    TextStyle? headlineSmall,
    TextStyle? titleLarge,
    TextStyle? titleMedium,
    TextStyle? titleSmall,
    TextStyle? bodyLarge,
    TextStyle? bodyMedium,
    TextStyle? bodySmall,
    TextStyle? labelLarge,
    TextStyle? labelMedium,
    TextStyle? labelSmall,
  }) {
    return ContigoTypography(
      displayLarge: displayLarge ?? this.displayLarge,
      displayMedium: displayMedium ?? this.displayMedium,
      displaySmall: displaySmall ?? this.displaySmall,
      headlineLarge: headlineLarge ?? this.headlineLarge,
      headlineMedium: headlineMedium ?? this.headlineMedium,
      headlineSmall: headlineSmall ?? this.headlineSmall,
      titleLarge: titleLarge ?? this.titleLarge,
      titleMedium: titleMedium ?? this.titleMedium,
      titleSmall: titleSmall ?? this.titleSmall,
      bodyLarge: bodyLarge ?? this.bodyLarge,
      bodyMedium: bodyMedium ?? this.bodyMedium,
      bodySmall: bodySmall ?? this.bodySmall,
      labelLarge: labelLarge ?? this.labelLarge,
      labelMedium: labelMedium ?? this.labelMedium,
      labelSmall: labelSmall ?? this.labelSmall,
    );
  }

  @override
  ContigoTypography lerp(ThemeExtension<ContigoTypography>? other, double t) {
    if (other is! ContigoTypography) return this;
    return ContigoTypography(
      displayLarge: TextStyle.lerp(displayLarge, other.displayLarge, t)!,
      displayMedium: TextStyle.lerp(displayMedium, other.displayMedium, t)!,
      displaySmall: TextStyle.lerp(displaySmall, other.displaySmall, t)!,
      headlineLarge: TextStyle.lerp(headlineLarge, other.headlineLarge, t)!,
      headlineMedium: TextStyle.lerp(headlineMedium, other.headlineMedium, t)!,
      headlineSmall: TextStyle.lerp(headlineSmall, other.headlineSmall, t)!,
      titleLarge: TextStyle.lerp(titleLarge, other.titleLarge, t)!,
      titleMedium: TextStyle.lerp(titleMedium, other.titleMedium, t)!,
      titleSmall: TextStyle.lerp(titleSmall, other.titleSmall, t)!,
      bodyLarge: TextStyle.lerp(bodyLarge, other.bodyLarge, t)!,
      bodyMedium: TextStyle.lerp(bodyMedium, other.bodyMedium, t)!,
      bodySmall: TextStyle.lerp(bodySmall, other.bodySmall, t)!,
      labelLarge: TextStyle.lerp(labelLarge, other.labelLarge, t)!,
      labelMedium: TextStyle.lerp(labelMedium, other.labelMedium, t)!,
      labelSmall: TextStyle.lerp(labelSmall, other.labelSmall, t)!,
    );
  }
}

class ContigoSpacing extends ThemeExtension<ContigoSpacing> {
  final double unit;
  final double xs;
  final double sm;
  final double md;
  final double lg;
  final double xl;
  final double xxl;
  final double xxxl;
  final double huge;

  const ContigoSpacing({
    required this.unit,
    required this.xs,
    required this.sm,
    required this.md,
    required this.lg,
    required this.xl,
    required this.xxl,
    required this.xxxl,
    required this.huge,
  });

  factory ContigoSpacing.regular() => const ContigoSpacing(
    unit: 4,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    huge: 96,
  );

  @override
  ContigoSpacing copyWith({
    double? unit,
    double? xs,
    double? sm,
    double? md,
    double? lg,
    double? xl,
    double? xxl,
    double? xxxl,
    double? huge,
  }) {
    return ContigoSpacing(
      unit: unit ?? this.unit,
      xs: xs ?? this.xs,
      sm: sm ?? this.sm,
      md: md ?? this.md,
      lg: lg ?? this.lg,
      xl: xl ?? this.xl,
      xxl: xxl ?? this.xxl,
      xxxl: xxxl ?? this.xxxl,
      huge: huge ?? this.huge,
    );
  }

  @override
  ContigoSpacing lerp(ThemeExtension<ContigoSpacing>? other, double t) {
    if (other is! ContigoSpacing) return this;
    return ContigoSpacing(
      unit: lerpDouble(unit, other.unit, t)!,
      xs: lerpDouble(xs, other.xs, t)!,
      sm: lerpDouble(sm, other.sm, t)!,
      md: lerpDouble(md, other.md, t)!,
      lg: lerpDouble(lg, other.lg, t)!,
      xl: lerpDouble(xl, other.xl, t)!,
      xxl: lerpDouble(xxl, other.xxl, t)!,
      xxxl: lerpDouble(xxxl, other.xxxl, t)!,
      huge: lerpDouble(huge, other.huge, t)!,
    );
  }
}

class ContigoRadius extends ThemeExtension<ContigoRadius> {
  final double xs;
  final double sm;
  final double md;
  final double lg;
  final double xl;
  final double full;

  const ContigoRadius({
    required this.xs,
    required this.sm,
    required this.md,
    required this.lg,
    required this.xl,
    required this.full,
  });

  factory ContigoRadius.regular() => const ContigoRadius(
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  );

  @override
  ContigoRadius copyWith({
    double? xs,
    double? sm,
    double? md,
    double? lg,
    double? xl,
    double? full,
  }) {
    return ContigoRadius(
      xs: xs ?? this.xs,
      sm: sm ?? this.sm,
      md: md ?? this.md,
      lg: lg ?? this.lg,
      xl: xl ?? this.xl,
      full: full ?? this.full,
    );
  }

  @override
  ContigoRadius lerp(ThemeExtension<ContigoRadius>? other, double t) {
    if (other is! ContigoRadius) return this;
    return ContigoRadius(
      xs: lerpDouble(xs, other.xs, t)!,
      sm: lerpDouble(sm, other.sm, t)!,
      md: lerpDouble(md, other.md, t)!,
      lg: lerpDouble(lg, other.lg, t)!,
      xl: lerpDouble(xl, other.xl, t)!,
      full: lerpDouble(full, other.full, t)!,
    );
  }
}

class ContigoGradients extends ThemeExtension<ContigoGradients> {
  final LinearGradient primary;
  final LinearGradient primaryDark;

  const ContigoGradients({
    required this.primary,
    required this.primaryDark,
  });

  factory ContigoGradients.light() => const ContigoGradients(
    primary: LinearGradient(
      colors: [Color(0xFF00668A), Color(0xFF85CDF7)],
      begin: Alignment(-1.0, -1.0),
      end: Alignment(1.0, 1.0),
    ),
    primaryDark: LinearGradient(
      colors: [Color(0xFFB4E8FF), Color(0xFF87CEEB)],
      begin: Alignment(-1.0, -1.0),
      end: Alignment(1.0, 1.0),
    ),
  );

  factory ContigoGradients.dark() => const ContigoGradients(
    primary: LinearGradient(
      colors: [Color(0xFFB4E8FF), Color(0xFF87CEEB)],
      begin: Alignment(-1.0, -1.0),
      end: Alignment(1.0, 1.0),
    ),
    primaryDark: LinearGradient(
      colors: [Color(0xFF00668A), Color(0xFF85CDF7)],
      begin: Alignment(-1.0, -1.0),
      end: Alignment(1.0, 1.0),
    ),
  );

  @override
  ContigoGradients copyWith({
    LinearGradient? primary,
    LinearGradient? primaryDark,
  }) {
    return ContigoGradients(
      primary: primary ?? this.primary,
      primaryDark: primaryDark ?? this.primaryDark,
    );
  }

  @override
  ContigoGradients lerp(ThemeExtension<ContigoGradients>? other, double t) {
    if (other is! ContigoGradients) return this;
    return ContigoGradients(
      primary: LinearGradient.lerp(primary, other.primary, t)!,
      primaryDark: LinearGradient.lerp(primaryDark, other.primaryDark, t)!,
    );
  }
}

class ContigoShadows extends ThemeExtension<ContigoShadows> {
  final List<BoxShadow> sm;
  final List<BoxShadow> md;
  final List<BoxShadow> lg;

  const ContigoShadows({
    required this.sm,
    required this.md,
    required this.lg,
  });

  factory ContigoShadows.regular() => ContigoShadows(
    sm: [
      BoxShadow(
        color: const Color(0xFF020617).withValues(alpha: 0.06),
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ],
    md: [
      BoxShadow(
        color: const Color(0xFF020617).withValues(alpha: 0.08),
        blurRadius: 16,
        offset: const Offset(0, 4),
      ),
    ],
    lg: [
      BoxShadow(
        color: const Color(0xFF020617).withValues(alpha: 0.10),
        blurRadius: 32,
        offset: const Offset(0, 12),
      ),
    ],
  );

  @override
  ContigoShadows copyWith({
    List<BoxShadow>? sm,
    List<BoxShadow>? md,
    List<BoxShadow>? lg,
  }) {
    return ContigoShadows(
      sm: sm ?? this.sm,
      md: md ?? this.md,
      lg: lg ?? this.lg,
    );
  }

  @override
  ContigoShadows lerp(ThemeExtension<ContigoShadows>? other, double t) {
    if (other is! ContigoShadows) return this;
    return ContigoShadows(
      sm: BoxShadow.lerpList(sm, other.sm, t)!,
      md: BoxShadow.lerpList(md, other.md, t)!,
      lg: BoxShadow.lerpList(lg, other.lg, t)!,
    );
  }
}

class ContigoMotion extends ThemeExtension<ContigoMotion> {
  final Duration fast;
  final Duration normal;
  final Duration slow;
  final Curve spring;

  const ContigoMotion({
    required this.fast,
    required this.normal,
    required this.slow,
    required this.spring,
  });

  factory ContigoMotion.regular() => const ContigoMotion(
    fast: Duration(milliseconds: 150),
    normal: Duration(milliseconds: 300),
    slow: Duration(milliseconds: 500),
    spring: Curves.easeInOutCubic,
  );

  @override
  ContigoMotion copyWith({
    Duration? fast,
    Duration? normal,
    Duration? slow,
    Curve? spring,
  }) {
    return ContigoMotion(
      fast: fast ?? this.fast,
      normal: normal ?? this.normal,
      slow: slow ?? this.slow,
      spring: spring ?? this.spring,
    );
  }

  @override
  ContigoMotion lerp(ThemeExtension<ContigoMotion>? other, double t) {
    if (other is! ContigoMotion) return this;
    return ContigoMotion(
      fast: Duration(milliseconds: lerpDouble(fast.inMilliseconds, other.fast.inMilliseconds, t)!.round()),
      normal: Duration(milliseconds: lerpDouble(normal.inMilliseconds, other.normal.inMilliseconds, t)!.round()),
      slow: Duration(milliseconds: lerpDouble(slow.inMilliseconds, other.slow.inMilliseconds, t)!.round()),
      spring: spring,
    );
  }
}

extension ContigoThemeX on BuildContext {
  ContigoColors get contigoColors => Theme.of(this).extension<ContigoColors>()!;
  ContigoTypography get contigoTypography => Theme.of(this).extension<ContigoTypography>()!;
  ContigoSpacing get contigoSpacing => Theme.of(this).extension<ContigoSpacing>()!;
  ContigoRadius get contigoRadius => Theme.of(this).extension<ContigoRadius>()!;
  ContigoGradients get contigoGradients => Theme.of(this).extension<ContigoGradients>()!;
  ContigoShadows get contigoShadows => Theme.of(this).extension<ContigoShadows>()!;
  ContigoMotion get contigoMotion => Theme.of(this).extension<ContigoMotion>()!;
}
