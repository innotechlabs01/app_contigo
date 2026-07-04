import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/core/theme/extensions.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ContigoColors', () {
    test('light constructor has correct primary', () {
      final colors = ContigoColors.light();
      expect(colors.primary.toARGB32(), 0xFF00668A);
    });

    test('dark constructor has correct primary', () {
      final colors = ContigoColors.dark();
      expect(colors.primary.toARGB32(), 0xFF8ECAFF);
    });

    test('copyWith preserves unchanged values', () {
      final colors = ContigoColors.light();
      final copied = colors.copyWith();
      expect(copied.primary.toARGB32(), colors.primary.toARGB32());
    });
  });

  group('ThemeData', () {
    test('light theme has ContigoColors extension', () {
      final theme = ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        extensions: [ContigoColors.light()],
      );
      final colors = theme.extension<ContigoColors>();
      expect(colors, isNotNull);
      expect(colors!.primary.toARGB32(), 0xFF00668A);
    });

    test('dark theme has ContigoColors extension', () {
      final theme = ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        extensions: [ContigoColors.dark()],
      );
      final colors = theme.extension<ContigoColors>();
      expect(colors, isNotNull);
      expect(colors!.primary.toARGB32(), 0xFF8ECAFF);
    });
  });
}
