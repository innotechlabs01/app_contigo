import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/router/guards.dart';
import '../../domain/entities/user.dart';
import '../../domain/use_cases/get_session_use_case.dart';
import '../../domain/use_cases/sign_in_with_email_use_case.dart';
import '../../domain/use_cases/sign_out_use_case.dart';

part 'auth_view_model.g.dart';

@Riverpod(keepAlive: true)
Future<User?> authState(Ref ref) async {
  final repo = ref.watch(authRepositoryProvider);
  final user = await GetSessionUseCase(repo)();
  if (ref.mounted) {
    if (user != null) {
      ref.read(authGuardProvider.notifier).authenticate();
      _syncAuthToken(ref);
    } else {
      ref.read(authGuardProvider.notifier).unauthenticate();
    }
  }
  return user;
}

@riverpod
class LoginViewModel extends _$LoginViewModel {
  @override
  FutureOr<void> build() {}

  Future<User?> signInWithEmail({
    required String email,
    required String password,
  }) async {
    state = const AsyncLoading();
    final repo = ref.read(authRepositoryProvider);
    final useCase = SignInWithEmailUseCase(repo);

    final result = await AsyncValue.guard(() => useCase(email, password));
    state = result.whenData((_) {});

    final user = result.hasValue ? result.value : null;
    if (user != null) {
      ref.read(authGuardProvider.notifier).authenticate();
      ref.invalidate(authStateProvider);
      _syncAuthToken(ref);
    }

    return user;
  }
}

@riverpod
class SignOutViewModel extends _$SignOutViewModel {
  @override
  FutureOr<void> build() {}

  Future<void> signOut() async {
    state = const AsyncLoading();
    final repo = ref.read(authRepositoryProvider);
    final useCase = SignOutUseCase(repo);
    state = await AsyncValue.guard(() => useCase());
    ref.read(authGuardProvider.notifier).unauthenticate();
    ref.invalidate(authStateProvider);
    setAuthToken(null);
  }
}

Future<void> _syncAuthToken(Ref ref) async {
  final storage = ref.read(secureStorageServiceProvider);
  final token = await storage.read('clerk_session_token');
  setAuthToken(token);
}
