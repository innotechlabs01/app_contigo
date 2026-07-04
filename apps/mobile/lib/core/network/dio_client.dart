import 'package:dio/dio.dart';
import 'api_endpoints.dart';

Dio createDioClient() {
  final dio = Dio(BaseOptions(
    baseUrl: ApiEndpoints.baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
    headers: {'Content-Type': 'application/json'},
  ));
  return dio;
}
