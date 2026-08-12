import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/client/presentation/screens/services_screen.dart';
import 'package:contigo_mobile/core/theme/light_theme.dart';

void main() {
  testWidgets('services screen renders category chips', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(theme: createLightTheme(), home: const ServicesScreen()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Salud'), findsOneWidget);
    expect(find.text('Logistica'), findsOneWidget);
    expect(find.text('Farmacia'), findsOneWidget);
    expect(find.text('Movilidad'), findsOneWidget);
  });
}
