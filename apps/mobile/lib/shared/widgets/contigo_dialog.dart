import 'package:flutter/material.dart';

enum ContigoDialogType { confirmation, error, success }

Future<bool?> showContigoDialog({
  required BuildContext context,
  required ContigoDialogType type,
  required String title,
  required String message,
  String? confirmLabel,
  String? cancelLabel,
}) {
  final icon = switch (type) {
    ContigoDialogType.confirmation => Icons.info_outline,
    ContigoDialogType.error => Icons.error_outline,
    ContigoDialogType.success => Icons.check_circle_outline,
  };

  final iconColor = switch (type) {
    ContigoDialogType.confirmation => null,
    ContigoDialogType.error => Colors.red,
    ContigoDialogType.success => Colors.green,
  };

  final actions = switch (type) {
    ContigoDialogType.confirmation => [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(cancelLabel ?? 'Cancel'),
        ),
        TextButton(
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(confirmLabel ?? 'Confirm'),
        ),
      ],
    ContigoDialogType.error => [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('OK'),
        ),
      ],
    ContigoDialogType.success => [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('OK'),
        ),
      ],
  };

  return showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      icon: Icon(icon, color: iconColor, size: 48),
      title: Text(title),
      content: Text(message),
      actions: actions,
    ),
  );
}
