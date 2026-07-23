import 'package:flutter/material.dart';

abstract class AppTypography {
  static const _fontFamily = 'Lexend';

  static TextStyle get displayLarge => const TextStyle(
    fontSize: 48, fontWeight: FontWeight.w600, height: 56 / 48, letterSpacing: -0.02 * 48, fontFamily: _fontFamily,
  );
  static TextStyle get displayMedium => const TextStyle(
    fontSize: 40, fontWeight: FontWeight.w500, height: 48 / 40, fontFamily: _fontFamily,
  );
  static TextStyle get displaySmall => const TextStyle(
    fontSize: 36, fontWeight: FontWeight.w400, height: 44 / 36, fontFamily: _fontFamily,
  );
  static TextStyle get headlineLarge => const TextStyle(
    fontSize: 32, fontWeight: FontWeight.w500, height: 40 / 32, letterSpacing: -0.01 * 32, fontFamily: _fontFamily,
  );
  static TextStyle get headlineMedium => const TextStyle(
    fontSize: 28, fontWeight: FontWeight.w500, height: 36 / 28, fontFamily: _fontFamily,
  );
  static TextStyle get headlineSmall => const TextStyle(
    fontSize: 24, fontWeight: FontWeight.w500, height: 32 / 24, fontFamily: _fontFamily,
  );
  static TextStyle get titleLarge => const TextStyle(
    fontSize: 22, fontWeight: FontWeight.w500, height: 28 / 22, fontFamily: _fontFamily,
  );
  static TextStyle get titleMedium => const TextStyle(
    fontSize: 20, fontWeight: FontWeight.w500, height: 28 / 20, fontFamily: _fontFamily,
  );
  static TextStyle get titleSmall => const TextStyle(
    fontSize: 14, fontWeight: FontWeight.w500, height: 20 / 14, fontFamily: _fontFamily,
  );
  static TextStyle get bodyLarge => const TextStyle(
    fontSize: 18, fontWeight: FontWeight.w300, height: 28 / 18, fontFamily: _fontFamily,
  );
  static TextStyle get bodyMedium => const TextStyle(
    fontSize: 16, fontWeight: FontWeight.w300, height: 24 / 16, fontFamily: _fontFamily,
  );
  static TextStyle get bodySmall => const TextStyle(
    fontSize: 14, fontWeight: FontWeight.w300, height: 20 / 14, fontFamily: _fontFamily,
  );
  static TextStyle get labelLarge => const TextStyle(
    fontSize: 14, fontWeight: FontWeight.w600, height: 20 / 14, letterSpacing: 0.01 * 14, fontFamily: _fontFamily,
  );
  static TextStyle get labelMedium => const TextStyle(
    fontSize: 14, fontWeight: FontWeight.w500, height: 20 / 14, letterSpacing: 0.01 * 14, fontFamily: _fontFamily,
  );
  static TextStyle get labelSmall => const TextStyle(
    fontSize: 12, fontWeight: FontWeight.w500, height: 16 / 12, letterSpacing: 0.01 * 12, fontFamily: _fontFamily,
  );
}
