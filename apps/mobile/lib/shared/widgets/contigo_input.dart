import 'package:flutter/material.dart';
import '../../core/theme/extensions.dart';

class ContigoInput extends StatelessWidget {
  final String label;
  final String? hintText;
  final bool obscureText;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final int maxLines;
  final TextInputAction? textInputAction;

  const ContigoInput({
    super.key,
    this.label = '',
    this.hintText,
    this.obscureText = false,
    this.controller,
    this.keyboardType,
    this.prefixIcon,
    this.suffixIcon,
    this.validator,
    this.initialValue,
    this.onChanged,
    this.maxLines = 1,
    this.textInputAction,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final radius = context.contigoRadius;
    final spacing = context.contigoSpacing;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label.isNotEmpty) ...[
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
        ],
        TextFormField(
          controller: controller,
          initialValue: controller != null ? null : initialValue,
          obscureText: obscureText,
          keyboardType: keyboardType,
          maxLines: maxLines,
          textInputAction: textInputAction,
          validator: validator,
          onChanged: onChanged,
          style: TextStyle(color: colors.onSurface, fontFamily: 'Lexend'),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(color: colors.onSurfaceVariant, fontFamily: 'Lexend'),
            prefixIcon: prefixIcon != null ? Icon(prefixIcon, color: colors.onSurfaceVariant) : null,
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: colors.surfaceContainerHighest,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide.none,
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide.none,
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide.none,
            ),
            contentPadding: EdgeInsets.symmetric(
              horizontal: spacing.lg,
              vertical: spacing.md,
            ),
          ),
        ),
      ],
    );
  }
}
