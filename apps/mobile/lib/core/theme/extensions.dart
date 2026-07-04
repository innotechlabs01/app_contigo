import 'dart:ui' show lerpDouble;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

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

  factory ContigoColors.light() => const ContigoColors(
    primary: Color(0xFF00668A),
    onPrimary: Color(0xFFFFFFFF),
    primaryContainer: Color(0xFF85CDF7),
    onPrimaryContainer: Color(0xFF001E30),
    secondary: Color(0xFF4D606E),
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: Color(0xFFD0E4F5),
    onSecondaryContainer: Color(0xFF091D29),
    surface: Color(0xFFF9F9F9),
    onSurface: Color(0xFF191C1E),
    surfaceDim: Color(0xFFD9D9D9),
    surfaceContainerLowest: Color(0xFFFFFFFF),
    surfaceContainerLow: Color(0xFFF3F3F3),
    surfaceContainer: Color(0xFFEDEDED),
    surfaceContainerHigh: Color(0xFFE7E7E7),
    surfaceContainerHighest: Color(0xFFE2E2E2),
  );

  factory ContigoColors.dark() => const ContigoColors(
    primary: Color(0xFF8ECAFF),
    onPrimary: Color(0xFF00344C),
    primaryContainer: Color(0xFF004D6E),
    onPrimaryContainer: Color(0xFFC9E6FF),
    secondary: Color(0xFFB4C8D9),
    onSecondary: Color(0xFF1F323F),
    secondaryContainer: Color(0xFF354956),
    onSecondaryContainer: Color(0xFFD0E4F5),
    surface: Color(0xFF111318),
    onSurface: Color(0xFFE2E2E6),
    surfaceDim: Color(0xFF111318),
    surfaceContainerLowest: Color(0xFF0C0E12),
    surfaceContainerLow: Color(0xFF191B20),
    surfaceContainer: Color(0xFF1D1F24),
    surfaceContainerHigh: Color(0xFF282A2F),
    surfaceContainerHighest: Color(0xFF33343A),
  );

  @override
  ContigoColors copyWith({
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
  ContigoColors lerp(ThemeExtension<ContigoColors>? other, double t) {
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
    displayLarge: GoogleFonts.lexend(
      fontSize: 57, fontWeight: FontWeight.w400, height: 1.12,
    ),
    displayMedium: GoogleFonts.lexend(
      fontSize: 45, fontWeight: FontWeight.w400, height: 1.16,
    ),
    displaySmall: GoogleFonts.lexend(
      fontSize: 36, fontWeight: FontWeight.w400, height: 1.22,
    ),
    headlineLarge: GoogleFonts.lexend(
      fontSize: 32, fontWeight: FontWeight.w600, height: 1.25,
    ),
    headlineMedium: GoogleFonts.lexend(
      fontSize: 28, fontWeight: FontWeight.w600, height: 1.29,
    ),
    headlineSmall: GoogleFonts.lexend(
      fontSize: 24, fontWeight: FontWeight.w600, height: 1.33,
    ),
    titleLarge: GoogleFonts.lexend(
      fontSize: 22, fontWeight: FontWeight.w500, height: 1.27,
    ),
    titleMedium: GoogleFonts.plusJakartaSans(
      fontSize: 16, fontWeight: FontWeight.w500, height: 1.50,
      letterSpacing: 0.15,
    ),
    titleSmall: GoogleFonts.plusJakartaSans(
      fontSize: 14, fontWeight: FontWeight.w500, height: 1.43,
      letterSpacing: 0.1,
    ),
    bodyLarge: GoogleFonts.lexend(
      fontSize: 16, fontWeight: FontWeight.w400, height: 1.50,
      letterSpacing: 0.5,
    ),
    bodyMedium: GoogleFonts.lexend(
      fontSize: 14, fontWeight: FontWeight.w400, height: 1.43,
      letterSpacing: 0.25,
    ),
    bodySmall: GoogleFonts.lexend(
      fontSize: 12, fontWeight: FontWeight.w400, height: 1.33,
      letterSpacing: 0.4,
    ),
    labelLarge: GoogleFonts.plusJakartaSans(
      fontSize: 14, fontWeight: FontWeight.w600, height: 1.43,
      letterSpacing: 0.1,
    ),
    labelMedium: GoogleFonts.plusJakartaSans(
      fontSize: 12, fontWeight: FontWeight.w500, height: 1.33,
      letterSpacing: 0.5,
    ),
    labelSmall: GoogleFonts.plusJakartaSans(
      fontSize: 11, fontWeight: FontWeight.w500, height: 1.45,
      letterSpacing: 0.5,
    ),
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
  final double xs;
  final double sm;
  final double md;
  final double lg;
  final double xl;
  final double xxl;
  final double xxxl;
  final double huge;

  const ContigoSpacing({
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
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    huge: 64,
  );

  @override
  ContigoSpacing copyWith({
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
    full: 56,
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
      colors: [Color(0xFF8ECAFF), Color(0xFF004D6E)],
      begin: Alignment(-1.0, -1.0),
      end: Alignment(1.0, 1.0),
    ),
  );

  factory ContigoGradients.dark() => const ContigoGradients(
    primary: LinearGradient(
      colors: [Color(0xFF8ECAFF), Color(0xFF004D6E)],
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
        color: const Color(0xFF00668A).withValues(alpha: 0.06),
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
    md: [
      BoxShadow(
        color: const Color(0xFF00668A).withValues(alpha: 0.08),
        blurRadius: 16,
        offset: Offset(0, 4),
      ),
    ],
    lg: [
      BoxShadow(
        color: const Color(0xFF00668A).withValues(alpha: 0.08),
        blurRadius: 32,
        offset: Offset(0, 12),
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
