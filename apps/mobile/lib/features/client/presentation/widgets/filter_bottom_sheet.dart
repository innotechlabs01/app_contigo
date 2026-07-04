import 'package:flutter/material.dart';

Future<String?> showFilterBottomSheet(BuildContext context) {
  return showModalBottomSheet<String>(
    context: context,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (context) => const _FilterContent(),
  );
}

class _FilterContent extends StatelessWidget {
  const _FilterContent();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Filtrar solicitudes',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 24),
            _FilterOption(
              label: 'Todas',
              value: null,
              icon: Icons.list,
            ),
            _FilterOption(
              label: 'Pendientes',
              value: 'pending',
              icon: Icons.schedule,
            ),
            _FilterOption(
              label: 'Aprobadas',
              value: 'approved',
              icon: Icons.check_circle,
            ),
            _FilterOption(
              label: 'En revisión',
              value: 'inReview',
              icon: Icons.visibility,
            ),
            _FilterOption(
              label: 'Rechazadas',
              value: 'rejected',
              icon: Icons.cancel,
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _FilterOption extends StatelessWidget {
  final String label;
  final String? value;
  final IconData icon;

  const _FilterOption({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListTile(
      leading: Icon(icon, color: theme.colorScheme.primary),
      title: Text(label),
      onTap: () => Navigator.pop(context, value),
    );
  }
}
