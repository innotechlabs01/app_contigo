import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../../../core/router/guards.dart';
import '../../data/datasources/clerk_auth_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_view_model.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  final storage = ref.watch(secureStorageServiceProvider);
  final datasource = ClerkAuthDatasource(storage);
  return AuthRepositoryImpl(datasource);
}

@riverpod
Future<User?> authState(Ref ref) async {
  final repo = ref.watch(authRepositoryProvider);
  final user = await repo.getSession();
  if (user != null) {
    ref.read(authGuardProvider.notifier).authenticate();
  } else {
    ref.read(authGuardProvider.notifier).unauthenticate();
  }
  return user;
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
