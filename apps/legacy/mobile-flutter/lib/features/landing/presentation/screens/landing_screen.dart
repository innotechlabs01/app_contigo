import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';
import '../../../../shared/widgets/contigo_button.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildAppBar(context),
              _buildHero(context),
              _buildProcess(context),
              _buildServices(context),
              _buildSecurity(context),
              _buildTestimonials(context),
              _buildCta(context),
              _buildFooter(context),
              SizedBox(height: spacing.xxl),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    final colors = context.contigoColors;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'App Contigo',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: colors.onSurface,
              fontFamily: 'Lexend',
            ),
          ),
          TextButton(
            onPressed: () => context.go(AppRoutes.login),
            style: TextButton.styleFrom(
              foregroundColor: colors.primary,
            ),
            child: const Text('Sign In'),
          ),
        ],
      ),
    );
  }

  Widget _buildHero(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [colors.primary, colors.surface],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      padding: EdgeInsets.symmetric(
        horizontal: spacing.lg,
        vertical: spacing.xxxl,
      ),
      child: Column(
        children: [
          Text(
            'Tranquilidad para ti y tus seres queridos',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w500,
              height: 1.25,
              color: colors.surface,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.md),
          Text(
            'Acompañamiento profesional y empático para cada momento del día.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w300,
              height: 1.5,
              color: colors.surface.withValues(alpha: 0.9),
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.xl),
          ContigoButton(
            variant: ContigoButtonVariant.primary,
            label: 'Solicitar acompañamiento',
            onPressed: () => context.go(AppRoutes.login),
            height: 56,
          ),
        ],
      ),
    );
  }

  Widget _buildProcess(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return Padding(
      padding: EdgeInsets.all(spacing.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'El Proceso',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: colors.primary,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
          Text(
            '¿Cómo funciona?',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w500,
              color: colors.onSurface,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.xl),
          _ProcessStep(
            icon: Icons.app_registration,
            number: '1',
            title: 'Request',
            description:
                'Selecciona el tipo de servicio y el horario que mejor se adapte a tus necesidades desde nuestra app.',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
          _ProcessStep(
            icon: Icons.person_search,
            number: '2',
            title: 'Match',
            description:
                'Te asignamos un acompañante certificado y verificado que encaje perfectamente con el perfil requerido.',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
          _ProcessStep(
            icon: Icons.visibility,
            number: '3',
            title: 'Monitor',
            description:
                'Sigue el progreso del servicio en tiempo real con notificaciones directas a tu móvil.',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
        ],
      ),
    );
  }

  Widget _buildServices(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return Container(
      width: double.infinity,
      color: colors.surfaceContainerLow,
      padding: EdgeInsets.all(spacing.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Nuestros Servicios',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: colors.primary,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
          Text(
            'Soluciones integrales diseñadas para brindar seguridad y bienestar.',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w300,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.xl),
          _ServiceHighlightCard(
            icon: Icons.medical_services,
            title: 'Medical Care',
            description:
                'Asistencia en citas médicas, recordatorio de medicamentos y seguimiento de salud básico con calidez humana.',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
          SizedBox(height: spacing.md),
          _ServiceHighlightCard(
            icon: Icons.shopping_basket,
            title: 'Personal Errands',
            description:
                'Te ayudamos con las compras del supermercado, trámites bancarios y gestiones administrativas del día a día.',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
          SizedBox(height: spacing.md),
          _ServiceHighlightCard(
            icon: Icons.directions_car,
            title: 'Vehicle Accompaniment',
            description:
                'Transporte seguro y asistido puerta a puerta para garantizar comodidad en cada traslado.',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
        ],
      ),
    );
  }

  Widget _buildSecurity(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return Padding(
      padding: EdgeInsets.all(spacing.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.shield, color: colors.primary, size: 28),
              SizedBox(width: spacing.sm),
              Text(
                'Seguridad ante todo',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w500,
                  color: colors.onSurface,
                  fontFamily: 'Lexend',
                ),
              ),
            ],
          ),
          SizedBox(height: spacing.sm),
          Text(
            'Monitoreo y Protección 24/7',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w300,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
          Text(
            'Utilizamos tecnología de vanguardia para que siempre sepas dónde están tus seres queridos y quién los acompaña.',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w300,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.lg),
          _SecurityFeature(
            icon: Icons.location_on,
            title: 'Real-time tracking',
            description:
                'Visualización exacta del recorrido en el mapa de la aplicación.',
            colors: colors,
            spacing: spacing,
          ),
          SizedBox(height: spacing.md),
          _SecurityFeature(
            icon: Icons.notification_important,
            title: 'Emergency Notifications',
            description:
                'Alertas instantáneas ante cualquier desvío o situación imprevista.',
            colors: colors,
            spacing: spacing,
          ),
        ],
      ),
    );
  }

  Widget _buildTestimonials(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return Container(
      width: double.infinity,
      color: colors.surfaceContainerLow,
      padding: EdgeInsets.all(spacing.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Historias de confianza',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w500,
              color: colors.onSurface,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.xl),
          _TestimonialCard(
            quote:
                '"Desde que contratamos App Contigo para mi madre, nuestra calidad de vida ha mejorado muchísimo. Los acompañantes son verdaderos ángeles."',
            name: 'Ricardo Mendoza',
            role: 'Hijo de usuaria',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
          SizedBox(height: spacing.md),
          _TestimonialCard(
            quote:
                '"Me siento muy seguro cuando salgo a mis trámites. Mi acompañante es puntual, respetuosa y siempre tiene una sonrisa lista."',
            name: 'Elena G.',
            role: 'Usuaria frecuente',
            colors: colors,
            spacing: spacing,
            radius: radius,
          ),
        ],
      ),
    );
  }

  Widget _buildCta(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return Padding(
      padding: EdgeInsets.all(spacing.xl),
      child: Column(
        children: [
          Text(
            '¿Listo para empezar?',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w500,
              color: colors.onSurface,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
          Text(
            'Únete a la comunidad que cuida con el corazón y la mejor tecnología.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w300,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.xl),
          ContigoButton(
            variant: ContigoButtonVariant.primary,
            label: 'Solicitar servicio',
            onPressed: () => context.go(AppRoutes.login),
            height: 56,
          ),
          SizedBox(height: spacing.md),
          ContigoButton(
            variant: ContigoButtonVariant.secondary,
            label: 'Trabaja con nosotros',
            onPressed: () => context.go(AppRoutes.login),
            height: 56,
          ),
        ],
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return Container(
      width: double.infinity,
      color: colors.surfaceContainerHighest,
      padding: EdgeInsets.all(spacing.xl),
      child: Column(
        children: [
          Text(
            'App Contigo',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: colors.onSurface,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.sm),
          Text(
            '© 2024 App Contigo. Built for empathy and clarity.',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w300,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
          SizedBox(height: spacing.md),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: spacing.md,
            children: [
              _FooterLink(text: 'Privacy Policy', colors: colors),
              _FooterLink(text: 'Terms of Service', colors: colors),
              _FooterLink(text: 'Accessibility Statement', colors: colors),
              _FooterLink(text: 'Support', colors: colors),
            ],
          ),
        ],
      ),
    );
  }

}

class _ProcessStep extends StatelessWidget {
  final IconData icon;
  final String number;
  final String title;
  final String description;
  final ContigoColors colors;
  final ContigoSpacing spacing;
  final ContigoRadius radius;

  const _ProcessStep({
    required this.icon,
    required this.number,
    required this.title,
    required this.description,
    required this.colors,
    required this.spacing,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: spacing.lg),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: colors.primaryContainer.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(radius.md),
            ),
            child: Icon(icon, color: colors.primary, size: 24),
          ),
          SizedBox(width: spacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$number. $title',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: colors.onSurface,
                    fontFamily: 'Lexend',
                  ),
                ),
                SizedBox(height: spacing.xs),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w300,
                    color: colors.onSurfaceVariant,
                    fontFamily: 'Lexend',
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ServiceHighlightCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final ContigoColors colors;
  final ContigoSpacing spacing;
  final ContigoRadius radius;

  const _ServiceHighlightCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.colors,
    required this.spacing,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(spacing.lg),
      decoration: BoxDecoration(
        color: colors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius.lg),
        border: Border.all(color: colors.outlineVariant, width: 1.0),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: colors.primaryContainer.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(radius.md),
            ),
            child: Icon(icon, color: colors.primary, size: 24),
          ),
          SizedBox(width: spacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: colors.onSurface,
                    fontFamily: 'Lexend',
                  ),
                ),
                SizedBox(height: spacing.xs),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w300,
                    color: colors.onSurfaceVariant,
                    fontFamily: 'Lexend',
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SecurityFeature extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final ContigoColors colors;
  final ContigoSpacing spacing;

  const _SecurityFeature({
    required this.icon,
    required this.title,
    required this.description,
    required this.colors,
    required this.spacing,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: colors.primary, size: 24),
        SizedBox(width: spacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: colors.onSurface,
                  fontFamily: 'Lexend',
                ),
              ),
              SizedBox(height: spacing.xs),
              Text(
                description,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w300,
                  color: colors.onSurfaceVariant,
                  fontFamily: 'Lexend',
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _TestimonialCard extends StatelessWidget {
  final String quote;
  final String name;
  final String role;
  final ContigoColors colors;
  final ContigoSpacing spacing;
  final ContigoRadius radius;

  const _TestimonialCard({
    required this.quote,
    required this.name,
    required this.role,
    required this.colors,
    required this.spacing,
    required this.radius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(spacing.lg),
      decoration: BoxDecoration(
        color: colors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius.lg),
        border: Border.all(color: colors.outlineVariant, width: 1.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: List.generate(
              5,
              (_) => Icon(Icons.star, color: colors.primary, size: 18),
            ),
          ),
          SizedBox(height: spacing.md),
          Text(
            quote,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w300,
              color: colors.onSurface,
              height: 1.5,
              fontFamily: 'Lexend',
              fontStyle: FontStyle.italic,
            ),
          ),
          SizedBox(height: spacing.md),
          Text(
            name,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: colors.onSurface,
              fontFamily: 'Lexend',
            ),
          ),
          Text(
            role,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w300,
              color: colors.onSurfaceVariant,
              fontFamily: 'Lexend',
            ),
          ),
        ],
      ),
    );
  }
}

class _FooterLink extends StatelessWidget {
  final String text;
  final ContigoColors colors;

  const _FooterLink({required this.text, required this.colors});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: colors.primary,
        fontFamily: 'Lexend',
      ),
    );
  }
}
