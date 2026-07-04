import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'settings_view_model.g.dart';

@riverpod
class SettingsState extends _$SettingsState {
  @override
  Map<String, bool> build() => {
    'pushEnabled': true,
    'emailEnabled': true,
    'sessionReminders': true,
  };

  void update(String key, bool value) {
    state = {...state, key: value};
  }
}
