import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:contigo_mobile/shared/widgets/contigo_shimmer.dart';

void main() {
  group('ContigoShimmer', () {
    testWidgets('renders child widget inside shimmer', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoShimmer(
            child: const Text('Loading...'),
          ),
        ),
      ));

      expect(find.text('Loading...'), findsOneWidget);
      expect(find.byType(Shimmer), findsOneWidget);
    });

    testWidgets('static card helper renders correctly', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoShimmer.card(height: 120),
        ),
      ));

      expect(find.byType(Shimmer), findsOneWidget);
      expect(find.byType(Container), findsWidgets);
    });

    testWidgets('static circle helper renders correctly', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoShimmer.circle(size: 48),
        ),
      ));

      expect(find.byType(Shimmer), findsOneWidget);
    });
  });
}
