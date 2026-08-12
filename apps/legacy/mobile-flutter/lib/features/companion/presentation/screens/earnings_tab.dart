import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/extensions.dart';

class EarningsTab extends ConsumerWidget {
  const EarningsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final radius = context.contigoRadius;

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(title: const Text('Ganancias')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _BalanceCard(
              colors: colors,
              typography: typography,
              radius: radius,
            ),
            SizedBox(height: 24),
            Text(
              'Historial de ganancias',
              style: typography.titleMedium.copyWith(color: colors.onSurface),
            ),
            SizedBox(height: 12),
            _EarningsItem(
              title: 'Acompanamiento Medico',
              amount: '\$85.00',
              date: '12 Ene 2025',
              colors: colors,
              typography: typography,
              radius: radius,
            ),
            SizedBox(height: 8),
            _EarningsItem(
              title: 'Recados Personales',
              amount: '\$45.00',
              date: '10 Ene 2025',
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

class _BalanceCard extends StatelessWidget {
  final ContigoColors colors;
  final ContigoTypography typography;
  final ContigoRadius radius;

  const _BalanceCard({
    required this.colors,
    required this.typography,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius.lg),
        border: Border.all(color: colors.outlineVariant, width: 1.0),
      ),
      child: Column(
        children: [
          Text(
            'Ganancias de este mes',
            style: typography.bodySmall.copyWith(
              color: colors.onSurfaceVariant,
            ),
          ),
          SizedBox(height: 8),
          Text(
            '\$1,250.00',
            style: typography.headlineLarge.copyWith(color: colors.primary),
          ),
        ],
      ),
    );
  }
}

class _EarningsItem extends StatelessWidget {
  final String title;
  final String amount;
  final String date;
  final ContigoColors colors;
  final ContigoTypography typography;
  final ContigoRadius radius;

  const _EarningsItem({
    required this.title,
    required this.amount,
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
        border: Border.all(color: colors.outlineVariant, width: 1.0),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: typography.bodyMedium.copyWith(
                    color: colors.onSurface,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  date,
                  style: typography.bodySmall.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          Text(
            amount,
            style: typography.titleMedium.copyWith(color: colors.primary),
          ),
        ],
      ),
    );
  }
}
