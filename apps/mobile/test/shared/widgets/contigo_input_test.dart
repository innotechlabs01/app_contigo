import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/core/theme/extensions.dart';
import 'package:contigo_mobile/shared/widgets/contigo_input.dart';

void main() {
  group('ContigoInput', () {
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

    testWidgets('renders label text', (tester) async {
      await tester.pumpWidget(buildApp(
        const ContigoInput(label: 'Email'),
      ));
      expect(find.text('Email'), findsOneWidget);
    });

    testWidgets('shows hint text', (tester) async {
      await tester.pumpWidget(buildApp(
        const ContigoInput(hintText: 'Enter your email'),
      ));
      expect(find.text('Enter your email'), findsOneWidget);
    });

    testWidgets('accepts user input', (tester) async {
      await tester.pumpWidget(buildApp(
        const ContigoInput(label: 'Name'),
      ));
      await tester.enterText(find.byType(ContigoInput), 'John');
      expect(find.text('John'), findsOneWidget);
    });

    testWidgets('shows validation error', (tester) async {
      final formKey = GlobalKey<FormState>();
      await tester.pumpWidget(buildApp(
        Form(
          key: formKey,
          child: ContigoInput(
            label: 'Email',
            validator: (value) {
              if (value == null || value.isEmpty) return 'Required';
              return null;
            },
          ),
        ),
      ));
      formKey.currentState!.validate();
      await tester.pumpAndSettle();
      expect(find.text('Required'), findsOneWidget);
    });

    testWidgets('toggles obscure text', (tester) async {
      await tester.pumpWidget(buildApp(
        const ContigoInput(label: 'Password', obscureText: true),
      ));
      final editable = tester.widget<EditableText>(
        find.descendant(
          of: find.byType(ContigoInput),
          matching: find.byType(EditableText),
        ),
      );
      expect(editable.obscureText, isTrue);
    });

    testWidgets('renders prefix icon', (tester) async {
      await tester.pumpWidget(buildApp(
        const ContigoInput(label: 'Email', prefixIcon: Icons.email),
      ));
      expect(find.byIcon(Icons.email), findsOneWidget);
    });
  });
}
