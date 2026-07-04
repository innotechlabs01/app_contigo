import 'package:flutter/material.dart';

class ServiceType {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final List<String> benefits;
  final String priceRange;

  const ServiceType({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    this.benefits = const [],
    this.priceRange = '',
  });

  static const List<ServiceType> mockServices = [
    ServiceType(
      id: 'medical',
      name: 'Acompañamiento Médico',
      description: 'Acompañantes capacitados para citas médicas, hospitalizaciones y terapias.',
      icon: Icons.medical_services,
      benefits: ['Citas médicas', 'Terapias físicas', 'Hospitalización', 'Emergencias'],
      priceRange: '\$15 - \$25/hora',
    ),
    ServiceType(
      id: 'daily',
      name: 'Compañía Diaria',
      description: 'Compañía para actividades cotidianas, paseos y tiempo de calidad.',
      icon: Icons.people,
      benefits: ['Paseos diarios', 'Conversación', 'Lectura', 'Actividades recreativas'],
      priceRange: '\$10 - \$20/hora',
    ),
    ServiceType(
      id: 'errands',
      name: 'Trámites y Gestiones',
      description: 'Apoyo con trámites bancarios, documentos y gestiones administrativas.',
      icon: Icons.assignment,
      benefits: ['Trámites bancarios', 'Documentos', 'Compras', 'Gestiones varias'],
      priceRange: '\$12 - \$22/hora',
    ),
  ];
}
