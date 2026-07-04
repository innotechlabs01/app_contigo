import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/app.dart';

void main() {
  group('App Integration', () {
    testWidgets('app starts and renders landing screen', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(child: ContigoApp()),
      );
      await tester.pumpAndSettle();
      expect(find.text('Contigo'), findsWidgets);
    });
  });
}
