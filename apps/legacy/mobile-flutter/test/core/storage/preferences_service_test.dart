import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:contigo_mobile/core/storage/preferences_service.dart';

void main() {
  group('PreferencesService', () {
    test('getBool returns false for missing key', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      final service = PreferencesService(prefs);
      expect(service.getBool('missing'), false);
    });

    test('setBool and getBool round-trip', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await SharedPreferences.getInstance();
      final service = PreferencesService(prefs);
      await service.setBool('key', true);
      expect(service.getBool('key'), true);
    });
  });
}
