import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:contigo_mobile/core/di/providers.dart';

void main() {
  group('Core Providers', () {
    test('dioProvider creates a Dio instance', () {
      final container = ProviderContainer();
      final dio = container.read(dioProvider);
      expect(dio, isNotNull);
      expect(dio.options.baseUrl, 'https://contigo.app/api');
      container.dispose();
    });

    test('preferencesServiceProvider creates service', () async {
      SharedPreferences.setMockInitialValues({});
      final container = ProviderContainer();
      await container.read(sharedPreferencesProvider.future);
      expect(container.read(preferencesServiceProvider), isNotNull);
      container.dispose();
    });

    test('secureStorageServiceProvider creates service', () {
      final container = ProviderContainer();
      expect(container.read(secureStorageServiceProvider), isNotNull);
      container.dispose();
    });

    test('connectivityServiceProvider creates service', () {
      final container = ProviderContainer();
      expect(container.read(connectivityServiceProvider), isNotNull);
      container.dispose();
    });
  });
}
