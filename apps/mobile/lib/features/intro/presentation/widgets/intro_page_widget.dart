import 'package:flutter/material.dart';
import '../../../../core/theme/extensions.dart';
import '../../domain/entities/intro_page_data.dart';

class IntroPageWidget extends StatelessWidget {
  final IntroPageData pageData;
  final bool isFirst;
  final bool isLast;

  const IntroPageWidget({
    super.key,
    required this.pageData,
    this.isFirst = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final typography = context.contigoTypography;

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: spacing.xl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Spacer(flex: 2),
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: colors.primaryContainer.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(60),
            ),
            child: Icon(pageData.icon, size: 60, color: colors.primary),
          ),
          SizedBox(height: spacing.xxl),
          Text(
            pageData.title,
            style: typography.headlineSmall.copyWith(color: colors.onSurface),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: spacing.md),
          Text(
            pageData.subtitle,
            style: typography.bodyLarge.copyWith(
              color: colors.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          const Spacer(flex: 3),
        ],
      ),
    );
  }
}
