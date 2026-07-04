import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_empty_state.dart';

void main() {
  group('ContigoEmptyState', () {
    testWidgets('shows icon and title', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoEmptyState(
            icon: Icons.inbox_outlined,
            title: 'No items',
          ),
        ),
      ));

      expect(find.byIcon(Icons.inbox_outlined), findsOneWidget);
      expect(find.text('No items'), findsOneWidget);
    });

    testWidgets('shows subtitle when provided', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoEmptyState(
            icon: Icons.inbox_outlined,
            title: 'No items',
            subtitle: 'Add some items to get started',
          ),
        ),
      ));

      expect(find.text('Add some items to get started'), findsOneWidget);
    });

    testWidgets('shows action button when provided', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoEmptyState(
            icon: Icons.inbox_outlined,
            title: 'No items',
            actionLabel: 'Add Item',
            onAction: () {},
          ),
        ),
      ));

      expect(find.text('Add Item'), findsOneWidget);
    });

    testWidgets('calls onAction when tapped', (tester) async {
      bool called = false;
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoEmptyState(
            icon: Icons.inbox_outlined,
            title: 'No items',
            actionLabel: 'Add Item',
            onAction: () => called = true,
          ),
        ),
      ));

      await tester.tap(find.text('Add Item'));
      expect(called, isTrue);
    });
  });
}
