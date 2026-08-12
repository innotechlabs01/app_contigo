import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_bottom_sheet.dart';

void main() {
  group('ContigoBottomSheet', () {
    testWidgets('shows title and content', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (context) => ElevatedButton(
            onPressed: () => showContigoBottomSheet(
              context: context,
              title: 'Test Title',
              content: const Text('Test Content'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));

      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Test Title'), findsOneWidget);
      expect(find.text('Test Content'), findsOneWidget);
    });
  });
}
