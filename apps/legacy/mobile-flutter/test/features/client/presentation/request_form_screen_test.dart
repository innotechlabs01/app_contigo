import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/client/presentation/screens/request_form_screen.dart';

void main() {
  testWidgets('request form shows stepper and first step', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: RequestFormScreen())),
    );
    await tester.pumpAndSettle();

    expect(find.text('Servicio'), findsOneWidget);
    expect(
      find.text('Selecciona el tipo de servicio'),
      findsOneWidget,
    );
  });
}
