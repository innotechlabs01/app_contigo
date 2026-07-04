import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/landing/presentation/screens/landing_screen.dart';

void main() {
  group('LandingScreen', () {
    testWidgets('renders hero section with tagline', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(child: MaterialApp(home: LandingScreen())),
      );
      expect(find.textContaining('Contigo'), findsWidgets);
    });

    testWidgets('renders services section', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(child: MaterialApp(home: LandingScreen())),
      );
      expect(find.textContaining('Servicios'), findsWidgets);
    });

    testWidgets('renders CTA section', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(child: MaterialApp(home: LandingScreen())),
      );
      expect(find.textContaining('empezar'), findsWidgets);
    });
  });
}
