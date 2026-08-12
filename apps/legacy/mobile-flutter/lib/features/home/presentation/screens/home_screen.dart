import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        backgroundColor: colors.surface,
        title: Text(
          'App Contigo',
          style: TextStyle(
            color: colors.onSurface,
            fontWeight: FontWeight.w600,
            fontFamily: 'Lexend',
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications_outlined, color: colors.onSurface),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(spacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeCard(colors, spacing, radius),
            SizedBox(height: spacing.xl),
            _buildQuickActions(context, colors, spacing, radius),
            SizedBox(height: spacing.xl),
            _buildRecentActivity(colors, spacing, radius),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeCard(
    ContigoColors colors,
    ContigoSpacing spacing,
    ContigoRadius radius,
  ) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(spacing.lg),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [colors.primaryContainer, colors.surfaceContainer],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(radius.lg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Bienvenido a Contigo',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              color: colors.onPrimaryContainer,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
          Text(
            'Tu salud y compañía, siempre contigo.',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w300,
              color: colors.onPrimaryContainer.withValues(alpha: 0.8),
              fontFamily: 'Lexend',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(
    BuildContext context,
    ContigoColors colors,
    ContigoSpacing spacing,
    ContigoRadius radius,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Acciones rápidas',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: colors.onSurface,
            fontFamily: 'Lexend',
          ),
        ),
        SizedBox(height: spacing.md),
        Row(
          children: [
            Expanded(
              child: _QuickActionCard(
                icon: Icons.add_circle_outline,
                label: 'Nuevo\nServicio',
                color: colors.primary,
                onTap: () => context.go(AppRoutes.services),
                colors: colors,
                spacing: spacing,
                radius: radius,
              ),
            ),
            SizedBox(width: spacing.md),
            Expanded(
              child: _QuickActionCard(
                icon: Icons.assignment_outlined,
                label: 'Mis\nSolicitudes',
                color: colors.secondary,
                onTap: () => context.go(AppRoutes.requests),
                colors: colors,
                spacing: spacing,
                radius: radius,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRecentActivity(
    ContigoColors colors,
    ContigoSpacing spacing,
    ContigoRadius radius,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Actividad reciente',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w500,
                color: colors.onSurface,
                fontFamily: 'Lexend',
              ),
            ),
            TextButton(
              onPressed: () {},
              child: Text(
                'Ver todo',
                style: TextStyle(color: colors.primary, fontFamily: 'Lexend'),
              ),
            ),
          ],
        ),
        SizedBox(height: spacing.md),
        _ActivityItem(
          icon: Icons.medical_services,
          title: 'Acompañamiento Médico',
          subtitle: 'Dr. Ramírez - 12 Ene 2025',
          status: 'Completado',
          colors: colors,
          spacing: spacing,
          radius: radius,
        ),
        SizedBox(height: spacing.sm),
        _ActivityItem(
          icon: Icons.shopping_basket,
          title: 'Recados Personales',
          subtitle: 'Supermercado - 10 Ene 2025',
          status: 'Completado',
          colors: colors,
          spacing: spacing,
          radius: radius,
        ),
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  final ContigoColors colors;
  final ContigoSpacing spacing;
  final ContigoRadius radius;

  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
    required this.colors,
    required this.spacing,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(spacing.lg),
        decoration: BoxDecoration(
          color: colors.surfaceContainer,
          borderRadius: BorderRadius.circular(radius.lg),
          border: Border.all(color: colors.outlineVariant, width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(radius.md),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            SizedBox(height: spacing.md),
            Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: colors.onSurface,
                fontFamily: 'Lexend',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String status;
  final ContigoColors colors;
  final ContigoSpacing spacing;
  final ContigoRadius radius;

  const _ActivityItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.status,
    required this.colors,
    required this.spacing,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(spacing.md),
      decoration: BoxDecoration(
        color: colors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius.md),
        border: Border.all(color: colors.outlineVariant, width: 1),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: colors.primaryContainer.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(radius.sm),
            ),
            child: Icon(icon, color: colors.primary, size: 20),
          ),
          SizedBox(width: spacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: colors.onSurface,
                    fontFamily: 'Lexend',
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w300,
                    color: colors.onSurfaceVariant,
                    fontFamily: 'Lexend',
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: spacing.sm,
              vertical: spacing.xs,
            ),
            decoration: BoxDecoration(
              color: colors.tertiaryContainer.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(radius.full),
            ),
            child: Text(
              status,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: colors.tertiary,
                fontFamily: 'Lexend',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
