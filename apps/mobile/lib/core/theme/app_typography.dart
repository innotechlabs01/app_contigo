import 'package:flutter/material.dart';

abstract class AppTypography {
  static const _displayFont = 'Lexend';
  static const _bodyFont = 'Lexend';
  static const _labelFont = 'PlusJakartaSans';

  static TextStyle get displayLarge => TextStyle(
    fontSize: 57, fontWeight: FontWeight.w400, height: 1.12, fontFamily: _displayFont,
  );
  static TextStyle get displayMedium => TextStyle(
    fontSize: 45, fontWeight: FontWeight.w400, height: 1.16, fontFamily: _displayFont,
  );
  static TextStyle get displaySmall => TextStyle(
    fontSize: 36, fontWeight: FontWeight.w400, height: 1.22, fontFamily: _displayFont,
  );
  static TextStyle get headlineLarge => TextStyle(
    fontSize: 32, fontWeight: FontWeight.w600, height: 1.25, fontFamily: _displayFont,
  );
  static TextStyle get headlineMedium => TextStyle(
    fontSize: 28, fontWeight: FontWeight.w600, height: 1.29, fontFamily: _displayFont,
  );
  static TextStyle get headlineSmall => TextStyle(
    fontSize: 24, fontWeight: FontWeight.w600, height: 1.33, fontFamily: _displayFont,
  );
  static TextStyle get titleLarge => TextStyle(
    fontSize: 22, fontWeight: FontWeight.w500, height: 1.27, fontFamily: _displayFont,
  );
  static TextStyle get titleMedium => TextStyle(
    fontSize: 16, fontWeight: FontWeight.w500, height: 1.50, letterSpacing: 0.15, fontFamily: _labelFont,
  );
  static TextStyle get titleSmall => TextStyle(
    fontSize: 14, fontWeight: FontWeight.w500, height: 1.43, letterSpacing: 0.1, fontFamily: _labelFont,
  );
  static TextStyle get bodyLarge => TextStyle(
    fontSize: 16, fontWeight: FontWeight.w400, height: 1.50, letterSpacing: 0.5, fontFamily: _bodyFont,
  );
  static TextStyle get bodyMedium => TextStyle(
    fontSize: 14, fontWeight: FontWeight.w400, height: 1.43, letterSpacing: 0.25, fontFamily: _bodyFont,
  );
  static TextStyle get bodySmall => TextStyle(
    fontSize: 12, fontWeight: FontWeight.w400, height: 1.33, letterSpacing: 0.4, fontFamily: _bodyFont,
  );
  static TextStyle get labelLarge => TextStyle(
    fontSize: 14, fontWeight: FontWeight.w600, height: 1.43, letterSpacing: 0.1, fontFamily: _labelFont,
  );
  static TextStyle get labelMedium => TextStyle(
    fontSize: 12, fontWeight: FontWeight.w500, height: 1.33, letterSpacing: 0.5, fontFamily: _labelFont,
  );
  static TextStyle get labelSmall => TextStyle(
    fontSize: 11, fontWeight: FontWeight.w500, height: 1.45, letterSpacing: 0.5, fontFamily: _labelFont,
  );
}
