import 'package:flutter/material.dart';
import '../../core/theme/extensions.dart';

class ContigoInput extends StatelessWidget {
  final String label;
  final String? hintText;
  final bool obscureText;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final String? Function(String?)? validator;

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
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: spacing.sm),
        ],
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          validator: validator,
          decoration: InputDecoration(
            hintText: hintText,
            prefixIcon: prefixIcon != null ? Icon(prefixIcon) : null,
            suffixIcon: suffixIcon != null ? Icon(suffixIcon) : null,
            filled: true,
            fillColor: colors.surfaceContainerHighest,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: BorderSide(
                color: colors.primary,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: const BorderSide(
                color: Colors.red,
                width: 1,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(radius.md),
              borderSide: const BorderSide(
                color: Colors.red,
                width: 2,
              ),
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
