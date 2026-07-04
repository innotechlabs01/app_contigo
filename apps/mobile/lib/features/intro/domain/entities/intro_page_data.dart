import 'package:flutter/material.dart';

class IntroPageData {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color? color;

  const IntroPageData({
    required this.title,
    required this.subtitle,
    required this.icon,
    this.color,
  });

  static const pages = [
    IntroPageData(
      title: 'Bienvenido a Contigo',
      subtitle:
          'Tu salud y compañía, siempre contigo. Conectamos adultos mayores con acompañantes confiables.',
      icon: Icons.favorite_outline,
    ),
    IntroPageData(
      title: 'Para ti que buscas compañía',
      subtitle:
          'Encuentra acompañantes verificados para citas médicas, terapia física, compañía diaria y más.',
      icon: Icons.people_outline,
    ),
    IntroPageData(
      title: 'Para ti que quieres ayudar',
      subtitle:
          'Regístrate en nuestra plataforma web y gestiona tu trabajo desde la app.',
      icon: Icons.volunteer_activism_outlined,
    ),
    IntroPageData(
      title: 'Comienza hoy',
      subtitle:
          'Únete a nuestra comunidad y descubre una nueva forma de cuidar y ser cuidado.',
      icon: Icons.celebration_outlined,
    ),
  ];
}
