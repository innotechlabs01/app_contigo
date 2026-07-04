import 'package:flutter/material.dart';

enum ContigoChipVariant { primary, secondary, success, warning }

class ContigoChip extends StatelessWidget {
  final String label;
  final ContigoChipVariant variant;
  final IconData? icon;
  final VoidCallback? onDeleted;

  const ContigoChip({
    super.key,
    required this.label,
    this.variant = ContigoChipVariant.primary,
    this.icon,
    this.onDeleted,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(56),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 16, color: _textColor),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: _textColor,
            ),
          ),
          if (onDeleted != null) ...[
            const SizedBox(width: 4),
            GestureDetector(
              onTap: onDeleted,
              child: Icon(Icons.close, size: 14, color: _textColor),
            ),
          ],
        ],
      ),
    );
  }

  Color get _backgroundColor => switch (variant) {
    ContigoChipVariant.primary => const Color(0xFF85CDF7),
    ContigoChipVariant.secondary => const Color(0xFFD0E4F5),
    ContigoChipVariant.success => const Color(0xFFA5D6A7),
    ContigoChipVariant.warning => const Color(0xFFFFF59D),
  };

  Color get _textColor => switch (variant) {
    ContigoChipVariant.primary => const Color(0xFF001E30),
    ContigoChipVariant.secondary => const Color(0xFF091D29),
    ContigoChipVariant.success => const Color(0xFF1B5E20),
    ContigoChipVariant.warning => const Color(0xFFF57F17),
  };
}
