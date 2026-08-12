import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../di/providers.dart';

part 'theme_mode.g.dart';

const _themeModeKey = 'theme_mode';

@riverpod
class ThemeModeController extends _$ThemeModeController {
  @override
  ThemeMode build() {
    final prefs = ref.watch(preferencesServiceProvider);
    return switch (prefs.getString(_themeModeKey)) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  Future<void> setMode(ThemeMode mode) async {
    final prefs = ref.read(preferencesServiceProvider);
    await prefs.setString(
      _themeModeKey,
      switch (mode) {
        ThemeMode.light => 'light',
        ThemeMode.dark => 'dark',
        ThemeMode.system => 'system',
      },
    );
    ref.invalidateSelf();
  }
}
