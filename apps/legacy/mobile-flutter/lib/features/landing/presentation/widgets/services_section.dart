import 'package:flutter/material.dart';

class ServicesSection extends StatelessWidget {
  const ServicesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFF3F3F3),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Servicios',
              style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 24),
          _ServiceCard(
            icon: Icons.medical_services,
            title: 'Acompañamiento Médico',
            description:
                'Acompañantes capacitados para citas médicas, hospitalizaciones y terapias.',
          ),
          const SizedBox(height: 16),
          _ServiceCard(
            icon: Icons.people,
            title: 'Compañía Diaria',
            description:
                'Compañía para actividades cotidianas, paseos y tiempo de calidad.',
          ),
          const SizedBox(height: 16),
          _ServiceCard(
            icon: Icons.assignment,
            title: 'Trámites y Gestiones',
            description:
                'Apoyo con trámites bancarios, documentos y gestiones administrativas.',
          ),
        ],
      ),
    );
  }
}

class _ServiceCard extends StatelessWidget {
  const _ServiceCard({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFEDEDED),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 32, color: const Color(0xFF00668A)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
