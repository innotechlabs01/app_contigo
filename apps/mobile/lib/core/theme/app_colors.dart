import 'package:flutter/material.dart';

abstract class AppColors {
  static const light = _LightColors();
  static const dark = _DarkColors();
}

class _LightColors {
  const _LightColors();

  Color get primary => const Color(0xFF00668A);
  Color get onPrimary => const Color(0xFFFFFFFF);
  Color get primaryContainer => const Color(0xFF85CDF7);
  Color get onPrimaryContainer => const Color(0xFF001E30);
  Color get primaryFixed => const Color(0xFF85CDF7);
  Color get primaryFixedDim => const Color(0xFF00668A);
  Color get onPrimaryFixed => const Color(0xFF001E30);
  Color get onPrimaryFixedVariant => const Color(0xFF004D6E);

  Color get secondary => const Color(0xFF4D606E);
  Color get onSecondary => const Color(0xFFFFFFFF);
  Color get secondaryContainer => const Color(0xFFD0E4F5);
  Color get onSecondaryContainer => const Color(0xFF091D29);
  Color get secondaryFixed => const Color(0xFFD0E4F5);
  Color get secondaryFixedDim => const Color(0xFF4D606E);
  Color get onSecondaryFixed => const Color(0xFF091D29);
  Color get onSecondaryFixedVariant => const Color(0xFF354956);

  Color get tertiary => const Color(0xFF605A72);
  Color get onTertiary => const Color(0xFFFFFFFF);
  Color get tertiaryContainer => const Color(0xFFE7DFF8);
  Color get onTertiaryContainer => const Color(0xFF1D172D);
  Color get tertiaryFixed => const Color(0xFFE7DFF8);
  Color get tertiaryFixedDim => const Color(0xFFCBBFDD);
  Color get onTertiaryFixed => const Color(0xFF1D172D);
  Color get onTertiaryFixedVariant => const Color(0xFF494157);

  Color get error => const Color(0xFFB3261E);
  Color get onError => const Color(0xFFFFFFFF);
  Color get errorContainer => const Color(0xFFF9DEDC);
  Color get onErrorContainer => const Color(0xFF410002);

  Color get surface => const Color(0xFFF9F9F9);
  Color get onSurface => const Color(0xFF191C1E);
  Color get surfaceDim => const Color(0xFFD9D9D9);
  Color get surfaceBright => const Color(0xFFF9F9F9);
  Color get surfaceContainerLowest => const Color(0xFFFFFFFF);
  Color get surfaceContainerLow => const Color(0xFFF3F3F3);
  Color get surfaceContainer => const Color(0xFFEDEDED);
  Color get surfaceContainerHigh => const Color(0xFFE7E7E7);
  Color get surfaceContainerHighest => const Color(0xFFE2E2E2);
  Color get onSurfaceVariant => const Color(0xFF43474E);
  Color get surfaceVariant => const Color(0xFFDDE3EA);
  Color get surfaceTint => const Color(0xFF00668A);

  Color get inverseSurface => const Color(0xFF2E3135);
  Color get inverseOnSurface => const Color(0xFFF0F0F4);
  Color get inversePrimary => const Color(0xFF85CDF7);

  Color get outline => const Color(0xFF79747E);
  Color get outlineVariant => const Color(0xFFC4C6D0);

  Color get background => const Color(0xFFFDFCFF);
  Color get onBackground => const Color(0xFF1A1C1E);

  Color get scrim => const Color(0xFF000000);
}

class _DarkColors {
  const _DarkColors();

  Color get primary => const Color(0xFFB4E8FF);
  Color get onPrimary => const Color(0xFF003544);
  Color get primaryContainer => const Color(0xFF87CEEB);
  Color get onPrimaryContainer => const Color(0xFF005870);
  Color get primaryFixed => const Color(0xFFBAEAFF);
  Color get primaryFixedDim => const Color(0xFF89D0ED);
  Color get onPrimaryFixed => const Color(0xFF001F29);
  Color get onPrimaryFixedVariant => const Color(0xFF004D62);

  Color get secondary => const Color(0xFF7BD0FF);
  Color get onSecondary => const Color(0xFF00354A);
  Color get secondaryContainer => const Color(0xFF00A6E0);
  Color get onSecondaryContainer => const Color(0xFF00374D);
  Color get secondaryFixed => const Color(0xFFC4E7FF);
  Color get secondaryFixedDim => const Color(0xFF7BD0FF);
  Color get onSecondaryFixed => const Color(0xFF001E2C);
  Color get onSecondaryFixedVariant => const Color(0xFF004C69);

  Color get tertiary => const Color(0xFFD2E2F8);
  Color get onTertiary => const Color(0xFF233143);
  Color get tertiaryContainer => const Color(0xFFB7C6DC);
  Color get onTertiaryContainer => const Color(0xFF445265);
  Color get tertiaryFixed => const Color(0xFFD4E4FA);
  Color get tertiaryFixedDim => const Color(0xFFB9C8DE);
  Color get onTertiaryFixed => const Color(0xFF0D1C2D);
  Color get onTertiaryFixedVariant => const Color(0xFF39485A);

  Color get error => const Color(0xFFFFB4AB);
  Color get onError => const Color(0xFF690005);
  Color get errorContainer => const Color(0xFF93000A);
  Color get onErrorContainer => const Color(0xFFFFDAD6);

  Color get surface => const Color(0xFF0B1326);
  Color get onSurface => const Color(0xFFDAE2FD);
  Color get surfaceDim => const Color(0xFF0B1326);
  Color get surfaceBright => const Color(0xFF31394D);
  Color get surfaceContainerLowest => const Color(0xFF060E20);
  Color get surfaceContainerLow => const Color(0xFF131B2E);
  Color get surfaceContainer => const Color(0xFF171F33);
  Color get surfaceContainerHigh => const Color(0xFF222A3D);
  Color get surfaceContainerHighest => const Color(0xFF2D3449);
  Color get onSurfaceVariant => const Color(0xFFBFC8CD);
  Color get surfaceVariant => const Color(0xFF2D3449);
  Color get surfaceTint => const Color(0xFF89D0ED);

  Color get inverseSurface => const Color(0xFFDAE2FD);
  Color get inverseOnSurface => const Color(0xFF283044);
  Color get inversePrimary => const Color(0xFF0C6780);

  Color get outline => const Color(0xFF899297);
  Color get outlineVariant => const Color(0xFF3F484C);

  Color get background => const Color(0xFF0B1326);
  Color get onBackground => const Color(0xFFDAE2FD);

  Color get scrim => const Color(0xFF000000);
}
