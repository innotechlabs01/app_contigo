import 'package:flutter/material.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_gradients.dart';
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

    return SizedBox(
      height: height,
      width: width ?? double.infinity,
      child: switch (variant) {
        ContigoButtonVariant.primary => _buildPrimary(isActive),
        ContigoButtonVariant.secondary => _buildSecondary(context, isActive),
        ContigoButtonVariant.tertiary => _buildTertiary(context, isActive),
      },
    );
  }

  Widget _buildPrimary(bool isActive) {
    return Container(
      decoration: BoxDecoration(
        gradient: isActive ? AppGradients.primary : null,
        color: isActive ? null : Colors.grey.shade300,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isActive ? onPressed : null,
          borderRadius: BorderRadius.circular(AppRadius.full),
          child: Center(child: _content(Colors.white)),
        ),
      ),
    );
  }

  Widget _buildSecondary(BuildContext context, bool isActive) {
    final colors = context.contigoColors;
    return OutlinedButton(
      onPressed: isActive ? onPressed : null,
      style: OutlinedButton.styleFrom(
        backgroundColor: isActive ? colors.secondaryContainer : Colors.grey.shade200,
        foregroundColor: isActive ? colors.onSecondaryContainer : Colors.grey,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
        ),
        side: BorderSide.none,
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
      ),
      child: _content(null),
    );
  }

  Widget _buildTertiary(BuildContext context, bool isActive) {
    final colors = context.contigoColors;
    return TextButton(
      onPressed: isActive ? onPressed : null,
      style: TextButton.styleFrom(
        foregroundColor: isActive ? colors.primary : Colors.grey,
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
      ),
      child: _content(null),
    );
  }

  Widget _content(Color? primaryTextColor) {
    if (isLoading) {
      return const SizedBox(
        height: 24,
        width: 24,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          color: Colors.white,
        ),
      );
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 20),
          const SizedBox(width: AppSpacing.sm),
        ],
        Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: primaryTextColor,
          ),
        ),
      ],
    );
  }
}
