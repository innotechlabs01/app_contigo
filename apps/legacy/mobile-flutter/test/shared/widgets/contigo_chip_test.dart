import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_chip.dart';

void main() {
  group('ContigoChip', () {
    testWidgets('renders label', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoChip(label: 'Active'),
        ),
      ));
      expect(find.text('Active'), findsOneWidget);
    });

    testWidgets('shows icon when provided', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoChip(label: 'With Icon', icon: Icons.star),
        ),
      ));
      expect(find.byIcon(Icons.star), findsOneWidget);
    });

    testWidgets('applies primary variant colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoChip(label: 'Primary', variant: ContigoChipVariant.primary),
        ),
      ));
      expect(find.text('Primary'), findsOneWidget);
    });

    testWidgets('applies secondary variant colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoChip(label: 'Secondary', variant: ContigoChipVariant.secondary),
        ),
      ));
      expect(find.text('Secondary'), findsOneWidget);
    });

    testWidgets('applies success variant colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoChip(label: 'Success', variant: ContigoChipVariant.success),
        ),
      ));
      expect(find.text('Success'), findsOneWidget);
    });

    testWidgets('applies warning variant colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoChip(label: 'Warning', variant: ContigoChipVariant.warning),
        ),
      ));
      expect(find.text('Warning'), findsOneWidget);
    });
  });
}
