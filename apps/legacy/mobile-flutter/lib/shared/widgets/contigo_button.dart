import 'package:flutter/material.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/extensions.dart';

enum ContigoButtonVariant { primary, secondary, tertiary }

class ContigoButton extends StatefulWidget {
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
  State<ContigoButton> createState() => _ContigoButtonState();
}

class _ContigoButtonState extends State<ContigoButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final isActive = widget.onPressed != null && !widget.isLoading;

    return SizedBox(
      height: widget.height,
      width: widget.width ?? double.infinity,
      child: Listener(
        onPointerDown: isActive ? (_) => setState(() => _pressed = true) : null,
        onPointerUp: isActive ? (_) => setState(() => _pressed = false) : null,
        onPointerCancel: isActive ? (_) => setState(() => _pressed = false) : null,
        child: AnimatedScale(
          scale: widget.variant == ContigoButtonVariant.primary && _pressed ? 0.98 : 1,
          duration: const Duration(milliseconds: 120),
          curve: Curves.easeOut,
          child: switch (widget.variant) {
            ContigoButtonVariant.primary => _buildPrimary(context, isActive),
            ContigoButtonVariant.secondary => _buildSecondary(context, isActive),
            ContigoButtonVariant.tertiary => _buildTertiary(context, isActive),
          },
        ),
      ),
    );
  }

  Widget _buildPrimary(BuildContext context, bool isActive) {
    final colors = context.contigoColors;
    final gradients = context.contigoGradients;

    return Container(
      decoration: BoxDecoration(
        gradient: gradients.primary,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        boxShadow: [
          BoxShadow(
            color: colors.primary.withValues(alpha: 0.18),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(AppRadius.xl),
        child: ElevatedButton(
          onPressed: isActive ? widget.onPressed : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            disabledBackgroundColor: colors.surfaceContainerHighest,
            disabledForegroundColor: colors.onSurfaceVariant,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppRadius.xl),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              fontFamily: 'Lexend',
            ),
          ),
          child: _content(context, isActive ? colors.onPrimary : colors.onSurfaceVariant),
        ),
      ),
    );
  }

  Widget _buildSecondary(BuildContext context, bool isActive) {
    final colors = context.contigoColors;

    return OutlinedButton(
      onPressed: isActive ? widget.onPressed : null,
      style: OutlinedButton.styleFrom(
        backgroundColor: Colors.transparent,
        foregroundColor: colors.primary,
        side: BorderSide.none,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xl),
        ),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          fontFamily: 'Lexend',
        ),
      ),
      child: _content(context, isActive ? colors.primary : colors.onSurfaceVariant),
    );
  }

  Widget _buildTertiary(BuildContext context, bool isActive) {
    final colors = context.contigoColors;

    return TextButton(
      onPressed: isActive ? widget.onPressed : null,
      style: TextButton.styleFrom(
        foregroundColor: isActive ? colors.primary : colors.onSurfaceVariant,
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          fontFamily: 'Lexend',
        ),
      ),
      child: _content(context, null),
    );
  }

  Widget _content(BuildContext context, Color? textColor) {
    if (widget.isLoading) {
      return SizedBox(
        height: 24,
        width: 24,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          color: textColor ?? Theme.of(context).colorScheme.primary,
        ),
      );
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.icon != null) ...[
          Icon(widget.icon, size: 20, color: textColor),
          const SizedBox(width: 8),
        ],
        Text(
          widget.label,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textColor),
        ),
      ],
    );
  }
}
