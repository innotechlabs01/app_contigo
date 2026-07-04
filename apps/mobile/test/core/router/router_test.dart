import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:contigo_mobile/core/router/router.dart';

void main() {
  group('Router', () {
    test('router is configured', () {
      final container = ProviderContainer();
      final router = container.read(routerProvider);
      expect(router, isA<GoRouter>());
      expect(router.configuration.routes.length, greaterThanOrEqualTo(5));
      container.dispose();
    });
  });
}
