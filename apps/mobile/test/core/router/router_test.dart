import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:contigo_mobile/core/di/providers.dart';
import 'package:contigo_mobile/core/router/router.dart';

void main() {
  group('Router', () {
    test('router is configured', () async {
      SharedPreferences.setMockInitialValues({'intro_completed': true});
      final prefs = await SharedPreferences.getInstance();
      final container = ProviderContainer(
        overrides: [sharedPreferencesProvider.overrideWithValue(prefs)],
      );
      final router = container.read(routerProvider);
      expect(router, isA<GoRouter>());
      expect(router.configuration.routes.length, greaterThanOrEqualTo(4));
      container.dispose();
    });
  });
}
