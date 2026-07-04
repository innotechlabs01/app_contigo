import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';
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
