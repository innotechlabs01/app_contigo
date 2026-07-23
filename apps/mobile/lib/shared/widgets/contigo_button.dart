import 'package:flutter/material.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/extensions.dart';

enum ContigoButtonVariant { primary, secondary, tertiary }

class ContigoButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ContigoButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final double? width;
  final double height;

  const ContigoButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = ContigoButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.width,
    this.height = 56,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = onPressed != null && !isLoading;
    final colors = context.contigoColors;

    return SizedBox(
      height: height,
      width: width ?? double.infinity,
      child: switch (variant) {
        ContigoButtonVariant.primary => _buildPrimary(colors, isActive),
        ContigoButtonVariant.secondary => _buildSecondary(colors, isActive),
        ContigoButtonVariant.tertiary => _buildTertiary(colors, isActive),
      },
    );
  }

  Widget _buildPrimary(ContigoColors colors, bool isActive) {
    return ElevatedButton(
      onPressed: isActive ? onPressed : null,
      style: ElevatedButton.styleFrom(
        backgroundColor: colors.primaryContainer,
        foregroundColor: colors.onPrimaryContainer,
        disabledBackgroundColor: colors.surfaceContainerHighest,
        disabledForegroundColor: colors.onSurfaceVariant,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          fontFamily: 'Lexend',
        ),
      ),
      child: _content(isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant),
    );
  }

  Widget _buildSecondary(ContigoColors colors, bool isActive) {
    return OutlinedButton(
      onPressed: isActive ? onPressed : null,
      style: OutlinedButton.styleFrom(
        backgroundColor: Colors.transparent,
        foregroundColor: colors.primary,
        side: BorderSide(
          color: isActive ? colors.primary : colors.outlineVariant,
          width: 1.5,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          fontFamily: 'Lexend',
        ),
      ),
      child: _content(isActive ? colors.primary : colors.onSurfaceVariant),
    );
  }

  Widget _buildTertiary(ContigoColors colors, bool isActive) {
    return TextButton(
      onPressed: isActive ? onPressed : null,
      style: TextButton.styleFrom(
        foregroundColor: isActive ? colors.primary : colors.onSurfaceVariant,
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          fontFamily: 'Lexend',
        ),
      ),
      child: _content(null),
    );
  }

  Widget _content(Color? textColor) {
    if (isLoading) {
      return const SizedBox(
        height: 24,
        width: 24,
        child: CircularProgressIndicator(strokeWidth: 2.5),
      );
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 20, color: textColor),
          const SizedBox(width: 8),
        ],
        Text(label, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textColor)),
      ],
    );
  }
}
