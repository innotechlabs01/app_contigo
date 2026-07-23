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
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _backgroundColor(scheme),
        borderRadius: BorderRadius.circular(56),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 16, color: _textColor(scheme)),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: _textColor(scheme),
            ),
          ),
          if (onDeleted != null) ...[
            const SizedBox(width: 4),
            GestureDetector(
              onTap: onDeleted,
              child: Icon(Icons.close, size: 14, color: _textColor(scheme)),
            ),
          ],
        ],
      ),
    );
  }

  Color _backgroundColor(ColorScheme scheme) => switch (variant) {
    ContigoChipVariant.primary => scheme.primaryContainer,
    ContigoChipVariant.secondary => scheme.secondaryContainer,
    ContigoChipVariant.success => scheme.tertiaryContainer,
    ContigoChipVariant.warning => scheme.errorContainer,
  };

  Color _textColor(ColorScheme scheme) => switch (variant) {
    ContigoChipVariant.primary => scheme.onPrimaryContainer,
    ContigoChipVariant.secondary => scheme.onSecondaryContainer,
    ContigoChipVariant.success => scheme.onTertiaryContainer,
    ContigoChipVariant.warning => scheme.onErrorContainer,
  };
}
