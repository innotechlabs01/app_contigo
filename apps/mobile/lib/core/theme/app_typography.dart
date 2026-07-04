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
