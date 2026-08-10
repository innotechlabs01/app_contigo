import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../auth/clerk_auth_service.dart';
import '../network/dio_client.dart';
import '../storage/preferences_service.dart';
import '../storage/secure_storage_service.dart';
import '../../features/auth/data/datasources/clerk_auth_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/client/data/datasources/request_api_datasource.dart';
import '../../features/client/data/repositories/request_repository_impl.dart';
import '../../features/client/domain/repositories/request_repository.dart';
import '../../features/companion/data/datasources/companion_api_datasource.dart';
import '../../features/companion/data/repositories/companion_repository_impl.dart';
import '../../features/companion/domain/repositories/companion_repository.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('Must be overridden in main.dart');
});

final preferencesServiceProvider = Provider<PreferencesService>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return PreferencesService(prefs);
});

final secureStorageServiceProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});

final clerkAuthServiceProvider = Provider<ClerkAuthService>((ref) {
  final storage = ref.watch(secureStorageServiceProvider);
  return ClerkAuthService(storage);
});

final dioProvider = Provider((ref) => createDioClient());

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final storage = ref.watch(secureStorageServiceProvider);
  final dio = ref.watch(dioProvider);
  final authService = ref.watch(clerkAuthServiceProvider);
  return AuthRepositoryImpl(
    ClerkAuthDatasource(
      storage: storage,
      dio: dio,
      authService: authService,
    ),
  );
});

final requestRepositoryProvider = Provider<RequestRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return RequestRepositoryImpl(RequestApiDatasource(dio));
});

final companionRepositoryProvider = Provider<CompanionRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return CompanionRepositoryImpl(CompanionApiDatasource(dio));
});
