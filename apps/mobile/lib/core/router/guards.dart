import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'guards.g.dart';

@riverpod
class AuthGuard extends _$AuthGuard {
  @override
  bool build() => false;

  void authenticate() => state = true;
  void unauthenticate() => state = false;
}
