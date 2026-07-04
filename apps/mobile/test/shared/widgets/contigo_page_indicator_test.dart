import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_page_indicator.dart';

void main() {
  group('ContigoPageIndicator', () {
    testWidgets('renders correct number of dots', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoPageIndicator(
            currentPage: 0,
            count: 5,
          ),
        ),
      ));

      expect(find.byType(ContigoPageIndicator), findsOneWidget);

      final widget = tester.widget<ContigoPageIndicator>(
        find.byType(ContigoPageIndicator),
      );
      expect(widget.count, 5);
    });

    testWidgets('highlights active dot', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoPageIndicator(
            currentPage: 2,
            count: 5,
          ),
        ),
      ));

      final indicator = tester.widget<ContigoPageIndicator>(
        find.byType(ContigoPageIndicator),
      );
      expect(indicator.currentPage, 2);
    });

    testWidgets('all dots rendered within a Row', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoPageIndicator(
            currentPage: 0,
            count: 3,
          ),
        ),
      ));

      expect(find.byType(Row), findsOneWidget);
    });
  });
}
