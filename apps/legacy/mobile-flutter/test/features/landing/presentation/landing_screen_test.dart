import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/landing/presentation/screens/landing_screen.dart';
import 'package:contigo_mobile/core/theme/light_theme.dart';

void main() {
  group('LandingScreen', () {
    testWidgets('renders hero section with tagline', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(theme: createLightTheme(), home: LandingScreen()),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.textContaining('App Contigo'), findsWidgets);
    });

    testWidgets('renders services section', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(theme: createLightTheme(), home: LandingScreen()),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.textContaining('Servicios'), findsWidgets);
    });

    testWidgets('renders CTA section', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(theme: createLightTheme(), home: LandingScreen()),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.textContaining('empezar'), findsWidgets);
    });
  });
}
