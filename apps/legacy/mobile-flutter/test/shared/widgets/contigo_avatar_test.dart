import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_avatar.dart';

void main() {
  group('ContigoAvatar', () {
    testWidgets('shows initials when no image', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoAvatar(name: 'John Doe'),
        ),
      ));
      expect(find.text('JD'), findsOneWidget);
    });

    testWidgets('shows online indicator', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoAvatar(name: 'John', isOnline: true),
        ),
      ));
      expect(find.text('J'), findsOneWidget);
    });

    testWidgets('shows offline indicator', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoAvatar(name: 'John', isOnline: false),
        ),
      ));
      expect(find.text('J'), findsOneWidget);
    });
  });
}
