import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/features/client/domain/entities/request_status.dart';
import 'package:contigo_mobile/shared/widgets/contigo_status_pill.dart';

void main() {
  group('ContigoStatusPill', () {
    testWidgets('renders pending text', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.pending),
        ),
      ));
      expect(find.text('Pending'), findsOneWidget);
    });

    testWidgets('renders approved text', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.approved),
        ),
      ));
      expect(find.text('Approved'), findsOneWidget);
    });

    testWidgets('renders rejected text', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.rejected),
        ),
      ));
      expect(find.text('Rejected'), findsOneWidget);
    });

    testWidgets('renders in_review text', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.inReview),
        ),
      ));
      expect(find.text('In Review'), findsOneWidget);
    });

    testWidgets('pending has warning colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.pending),
        ),
      ));
      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(ContigoStatusPill),
          matching: find.byType(Container).first,
        ),
      );
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFFFF59D));
    });

    testWidgets('approved has success colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.approved),
        ),
      ));
      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(ContigoStatusPill),
          matching: find.byType(Container).first,
        ),
      );
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFA5D6A7));
    });

    testWidgets('rejected has error colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.rejected),
        ),
      ));
      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(ContigoStatusPill),
          matching: find.byType(Container).first,
        ),
      );
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFEF9A9A));
    });

    testWidgets('in_review has info colors', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStatusPill(status: RequestStatus.inReview),
        ),
      ));
      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(ContigoStatusPill),
          matching: find.byType(Container).first,
        ),
      );
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFF90CAF9));
    });
  });
}
