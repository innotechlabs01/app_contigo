import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'extensions.dart';

ThemeData createDarkTheme() {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
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
      ContigoColors.dark(),
      ContigoTypography.regular(),
      ContigoSpacing.regular(),
      ContigoRadius.regular(),
      ContigoGradients.dark(),
      ContigoShadows.regular(),
      ContigoMotion.regular(),
    ],
  );
}
