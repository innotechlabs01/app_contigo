import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:contigo_mobile/features/companion/presentation/screens/companion_shell.dart';

void main() {
  testWidgets('companion shell shows bottom navigation', (tester) async {
    final router = GoRouter(
      initialLocation: '/companion/home',
      routes: [
        ShellRoute(
          builder: (context, state, child) => CompanionShell(child: child),
          routes: [
            GoRoute(
              path: '/companion/home',
              builder: (context, state) => const SizedBox(),
            ),
          ],
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp.router(
          routerConfig: router,
        ),
      ),
    );

    expect(find.byType(BottomNavigationBar), findsOneWidget);
    expect(find.text('Inicio'), findsOneWidget);
    expect(find.text('Solicitudes'), findsOneWidget);
    expect(find.text('Calendario'), findsOneWidget);
    expect(find.text('Ganancias'), findsOneWidget);
  });
}
