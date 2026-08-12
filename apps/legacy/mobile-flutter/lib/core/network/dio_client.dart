import 'package:dio/dio.dart';
import 'api_endpoints.dart';
import 'interceptors/auth_interceptor.dart';
import 'interceptors/retry_interceptor.dart';
import 'interceptors/offline_interceptor.dart';
import 'interceptors/logging_interceptor.dart';
import 'interceptors/error_interceptor.dart';

AuthInterceptor? _sharedAuthInterceptor;

Dio createDioClient() {
  final authInterceptor = AuthInterceptor();
  _sharedAuthInterceptor = authInterceptor;

  final dio = Dio(BaseOptions(
    baseUrl: kApiBaseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
    headers: {'Content-Type': 'application/json'},
  ));

  dio.interceptors.addAll([
    authInterceptor,
    OfflineInterceptor(),
    LoggingInterceptor(),
    ErrorInterceptor(),
    RetryInterceptor(dio: dio),
  ]);

  return dio;
}

void setAuthToken(String? token) {
  _sharedAuthInterceptor?.setToken(token);
}
