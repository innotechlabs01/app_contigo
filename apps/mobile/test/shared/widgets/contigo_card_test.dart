import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_card.dart';

void main() {
  group('ContigoCard', () {
    testWidgets('renders child widget', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoCard(
            child: const Text('Hello'),
          ),
        ),
      ));
      expect(find.text('Hello'), findsOneWidget);
    });

    testWidgets('calls onTap when tapped', (tester) async {
      bool tapped = false;
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoCard(
            child: const Text('Tap me'),
            onTap: () => tapped = true,
          ),
        ),
      ));
      await tester.tap(find.text('Tap me'));
      expect(tapped, isTrue);
    });

    testWidgets('applies padding', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoCard(
            child: const Text('Padded'),
            padding: const EdgeInsets.all(32),
          ),
        ),
      ));
      final card = tester.widget<ContigoCard>(find.byType(ContigoCard));
      expect(card.padding, const EdgeInsets.all(32));
    });
  });
}
