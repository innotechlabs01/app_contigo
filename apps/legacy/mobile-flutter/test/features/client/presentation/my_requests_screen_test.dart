import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/client/presentation/screens/my_requests_screen.dart';
import 'package:contigo_mobile/core/theme/light_theme.dart';

Widget _wrap(Widget child) {
  return ProviderScope(
    child: MaterialApp(theme: createLightTheme(), home: child),
  );
}

void main() {
  testWidgets('shows empty state when no requests', (tester) async {
    await tester.pumpWidget(_wrap(const MyRequestsScreen()));
    await tester.pumpAndSettle();
    expect(find.text('Mis Solicitudes'), findsOneWidget);
  });

  testWidgets('shows mock request cards', (tester) async {
    await tester.pumpWidget(_wrap(const MyRequestsScreen()));
    await tester.pumpAndSettle();
    expect(find.text('Cita Médica'), findsOneWidget);
    expect(find.text('Recados Personales'), findsOneWidget);
    expect(find.text('Medicamentos'), findsOneWidget);
  });

  testWidgets('renders app bar title', (tester) async {
    await tester.pumpWidget(_wrap(const MyRequestsScreen()));
    await tester.pumpAndSettle();
    expect(find.text('Mis Solicitudes'), findsOneWidget);
  });
}
