import 'package:flutter/material.dart';
import '../widgets/hero_section.dart';
import '../widgets/services_section.dart';
import '../widgets/testimonials_section.dart';
import '../widgets/cta_section.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            HeroSection(),
            ServicesSection(),
            TestimonialsSection(),
            CtaSection(),
          ],
        ),
      ),
    );
  }
}
