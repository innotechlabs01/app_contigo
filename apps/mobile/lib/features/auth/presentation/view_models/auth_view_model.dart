import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../../../core/router/guards.dart';
import '../../data/datasources/clerk_auth_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/use_cases/get_session_use_case.dart';
import '../../domain/use_cases/sign_in_with_email_use_case.dart';
import '../../domain/use_cases/sign_out_use_case.dart';

part 'auth_view_model.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  final storage = ref.watch(secureStorageServiceProvider);
  final datasource = ClerkAuthDatasource(storage);
  return AuthRepositoryImpl(datasource);
}

@Riverpod(keepAlive: true)
Future<User?> authState(Ref ref) async {
  final repo = ref.watch(authRepositoryProvider);
  final user = await GetSessionUseCase(repo)();
  if (ref.mounted) {
    if (user != null) {
      ref.read(authGuardProvider.notifier).authenticate();
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
  }
}

Future<void> mockSignIn(Ref ref, User user) async {
  final storage = ref.read(secureStorageServiceProvider);
  final datasource = ClerkAuthDatasource(storage);
  await datasource.saveSession(
    token: 'mock_token',
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  );
  ref.read(authGuardProvider.notifier).authenticate();
  ref.invalidate(authStateProvider);
}
