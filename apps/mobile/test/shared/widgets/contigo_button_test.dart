import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/core/theme/extensions.dart';
import 'package:contigo_mobile/shared/widgets/contigo_button.dart';

void main() {
  group('ContigoButton', () {
    Widget buildApp(Widget child) {
      return MaterialApp(
        theme: ThemeData(
          useMaterial3: true,
          extensions: [
            ContigoColors.light(),
            ContigoTypography.regular(),
            ContigoSpacing.regular(),
            ContigoRadius.regular(),
            ContigoGradients.light(),
          ],
        ),
        home: Scaffold(body: child),
      );
    }

    testWidgets('renders primary variant by default', (tester) async {
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Test', onPressed: () {}),
      ));
      expect(find.text('Test'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      bool pressed = false;
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Tap', onPressed: () => pressed = true),
      ));
      await tester.tap(find.text('Tap'));
      expect(pressed, isTrue);
    });

    testWidgets('shows CircularProgressIndicator when loading', (tester) async {
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Loading', onPressed: () {}, isLoading: true),
      ));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('does not call onPressed when loading', (tester) async {
      bool pressed = false;
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Load', onPressed: () => pressed = true, isLoading: true),
      ));
      await tester.tap(find.byType(ContigoButton));
      expect(pressed, isFalse);
    });

    testWidgets('renders secondary variant', (tester) async {
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Secondary', onPressed: () {}, variant: ContigoButtonVariant.secondary),
      ));
      expect(find.text('Secondary'), findsOneWidget);
    });

    testWidgets('renders tertiary variant', (tester) async {
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Tertiary', onPressed: () {}, variant: ContigoButtonVariant.tertiary),
      ));
      expect(find.text('Tertiary'), findsOneWidget);
    });

    testWidgets('renders icon when provided', (tester) async {
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'With Icon', onPressed: () {}, icon: Icons.add),
      ));
      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('button is disabled when onPressed is null', (tester) async {
      bool pressed = false;
      await tester.pumpWidget(buildApp(
        ContigoButton(label: 'Disabled', onPressed: null),
      ));
      await tester.tap(find.text('Disabled'));
      expect(pressed, isFalse);
    });
  });
}
