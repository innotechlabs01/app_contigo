import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/client/presentation/screens/services_screen.dart';

void main() {
  testWidgets('services screen renders service cards', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: ServicesScreen())),
    );

    await tester.pumpAndSettle();

    expect(find.text('Acompañamiento Médico'), findsOneWidget);
    expect(find.text('Compañía Diaria'), findsOneWidget);
    expect(find.text('Trámites y Gestiones'), findsOneWidget);
  });
}
