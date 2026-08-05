import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../network/dio_client.dart';
import '../storage/preferences_service.dart';
import '../storage/secure_storage_service.dart';
import '../../features/client/data/datasources/request_api_datasource.dart';
import '../../features/client/data/repositories/request_repository_impl.dart';
import '../../features/client/domain/repositories/request_repository.dart';

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

final dioProvider = Provider((ref) => createDioClient());

final requestRepositoryProvider = Provider<RequestRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return RequestRepositoryImpl(RequestApiDatasource(dio));
});
