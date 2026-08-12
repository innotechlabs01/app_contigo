import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/extensions.dart';

class HomeTab extends ConsumerWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final radius = context.contigoRadius;

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(title: const Text('Panel de Companero')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _WelcomeCard(
              colors: colors,
              typography: typography,
              radius: radius,
            ),
            SizedBox(height: 16),
            _StatsRow(colors: colors, typography: typography, radius: radius),
            SizedBox(height: 32),
            Text(
              'Proximas Sesiones',
              style: typography.titleLarge.copyWith(color: colors.onSurface),
            ),
            SizedBox(height: 12),
            _SessionCard(
              title: 'Acompanamiento Medico',
              client: 'Maria Lopez',
              date: '15 Ene, 10:00 AM',
              colors: colors,
              typography: typography,
              radius: radius,
            ),
            SizedBox(height: 8),
            _SessionCard(
              title: 'Recados Personales',
              client: 'Carlos Ruiz',
              date: '16 Ene, 2:00 PM',
              colors: colors,
              typography: typography,
              radius: radius,
            ),
          ],
        ),
      ),
    );
  }
}

class _WelcomeCard extends StatelessWidget {
  final ContigoColors colors;
  final ContigoTypography typography;
  final ContigoRadius radius;

  const _WelcomeCard({
    required this.colors,
    required this.typography,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Bienvenido,',
          style: typography.bodyLarge.copyWith(color: colors.onSurfaceVariant),
        ),
        Text(
          'Companero',
          style: typography.headlineMedium.copyWith(color: colors.onSurface),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final ContigoColors colors;
  final ContigoTypography typography;
  final ContigoRadius radius;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.colors,
    required this.typography,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius.lg),
        border: Border.all(color: colors.outlineVariant, width: 1.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: colors.primary, size: 24),
          SizedBox(height: 12),
          Text(
            value,
            style: typography.headlineSmall.copyWith(color: colors.onSurface),
          ),
          SizedBox(height: 4),
          Text(
            label,
            style: typography.bodySmall.copyWith(
              color: colors.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final ContigoColors colors;
  final ContigoTypography typography;
  final ContigoRadius radius;

  const _StatsRow({
    required this.colors,
    required this.typography,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            label: 'Solicitudes Pendientes',
            value: '3',
            icon: Icons.pending_actions,
            colors: colors,
            typography: typography,
            radius: radius,
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Aceptadas',
            value: '8',
            icon: Icons.check_circle,
            colors: colors,
            typography: typography,
            radius: radius,
          ),
        ),
      ],
    );
  }
}

class _SessionCard extends StatelessWidget {
  final String title;
  final String client;
  final String date;
  final ContigoColors colors;
  final ContigoTypography typography;
  final ContigoRadius radius;

  const _SessionCard({
    required this.title,
    required this.client,
    required this.date,
    required this.colors,
    required this.typography,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius.md),
        border: Border.all(color: colors.outlineVariant, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: typography.titleSmall.copyWith(color: colors.onSurface),
          ),
          SizedBox(height: 4),
          Text(
            client,
            style: typography.bodySmall.copyWith(
              color: colors.onSurfaceVariant,
            ),
          ),
          SizedBox(height: 4),
          Text(
            date,
            style: typography.bodySmall.copyWith(color: colors.primary),
          ),
        ],
      ),
    );
  }
}
