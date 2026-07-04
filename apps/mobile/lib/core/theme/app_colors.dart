import 'package:flutter/material.dart';

abstract class AppColors {
  static const light = _LightColors();
  static const dark = _DarkColors();

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
