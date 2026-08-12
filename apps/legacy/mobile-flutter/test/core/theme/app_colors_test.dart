import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/core/theme/app_colors.dart';

void main() {
  group('AppColors Light', () {
    test('primary should be #00668A', () {
      expect(AppColors.light.primary.value, 0xFF00668A);
    });

    test('primaryContainer should be #85CDF7', () {
      expect(AppColors.light.primaryContainer.value, 0xFF85CDF7);
    });

    test('surface should be #F9F9F9', () {
      expect(AppColors.light.surface.value, 0xFFF9F9F9);
    });
  });

  group('AppColors Dark', () {
    test('should not be null', () {
      expect(AppColors.dark, isNotNull);
    });
  });
}
