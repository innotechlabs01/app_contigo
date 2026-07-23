import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/settings/presentation/screens/settings_screen.dart';
import 'package:contigo_mobile/core/theme/light_theme.dart';

void main() {
  testWidgets('settings screen shows menu items', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(theme: createLightTheme(), home: SettingsScreen()),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Configuración'), findsOneWidget);
    expect(find.text('Perfil'), findsWidgets);
    expect(find.textContaining('Notificaciones'), findsWidgets);
    expect(find.textContaining('Cerrar sesión'), findsWidgets);
  });
}
