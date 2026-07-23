import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../../core/network/dio_client.dart';
import '../../core/network/interceptors/auth_interceptor.dart';
import '../../core/network/interceptors/connectivity_service.dart';
import '../../core/storage/preferences_service.dart';
import '../../core/storage/secure_storage_service.dart';

part 'providers.g.dart';

@riverpod
AuthInterceptor authInterceptor(Ref ref) {
  final dio = ref.watch(dioProvider);
  return dio.interceptors.whereType<AuthInterceptor>().first;
}

@riverpod
Dio dio(Ref ref) => createDioClient();

@riverpod
SharedPreferences sharedPreferences(Ref ref) => throw UnimplementedError('Override in main.dart');

@riverpod
PreferencesService preferencesService(Ref ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return PreferencesService(prefs);
}

@riverpod
SecureStorageService secureStorageService(Ref ref) =>
    SecureStorageService();

@riverpod
ConnectivityService connectivityService(Ref ref) =>
    ConnectivityService(Connectivity());
