import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/settings/presentation/screens/settings_screen.dart';

void main() {
  testWidgets('settings screen shows menu items', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: SettingsScreen())),
    );
    expect(find.text('Configuración'), findsOneWidget);
    expect(find.text('Perfil'), findsWidgets);
    expect(find.text('Notificaciones'), findsWidgets);
    expect(find.text('Cerrar sesión'), findsWidgets);
  });
}
