import 'package:dio/dio.dart';
import '../network/api_result.dart';

abstract class ErrorHandler {
  static Failure handle(Object error, [StackTrace? stack]) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return NetworkFailure('Connection timed out. Please check your internet connection.');
        case DioExceptionType.connectionError:
          return NetworkFailure('No internet connection. Please try again.');
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode ?? 0;
          final message = error.response?.data?['message'] as String? ?? 'An error occurred';
          if (statusCode == 401) return AuthFailure();
          if (statusCode == 422) return ValidationFailure(message);
          return ServerFailure(message, code: statusCode.toString());
        case DioExceptionType.cancel:
          return NetworkFailure('Request was cancelled');
        default:
          return ServerFailure('An unexpected error occurred');
      }
    }
    return ServerFailure(error.toString());
  }
}
