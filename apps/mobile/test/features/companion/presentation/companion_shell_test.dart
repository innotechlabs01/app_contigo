import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:contigo_mobile/features/companion/presentation/screens/companion_shell.dart';
import 'package:contigo_mobile/core/theme/extensions.dart';
import 'package:contigo_mobile/core/theme/light_theme.dart';

void main() {
  testWidgets('companion shell shows navigation tabs', (tester) async {
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
          theme: createLightTheme(),
          routerConfig: router,
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byIcon(Icons.home), findsOneWidget);
    expect(find.byIcon(Icons.assignment), findsOneWidget);
    expect(find.byIcon(Icons.calendar_today), findsOneWidget);
    expect(find.byIcon(Icons.payments), findsOneWidget);
  });
}
