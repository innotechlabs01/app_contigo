import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:contigo_mobile/core/error/error_handler.dart';
import 'package:contigo_mobile/core/network/api_result.dart';

void main() {
  group('ErrorHandler', () {
    test('DioException with connectionTimeout returns NetworkFailure', () {
      final error = DioException(
        type: DioExceptionType.connectionTimeout,
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<NetworkFailure>());
    });

    test('DioException with connectionError returns NetworkFailure', () {
      final error = DioException(
        type: DioExceptionType.connectionError,
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<NetworkFailure>());
    });

    test('DioException with 500 response returns ServerFailure', () {
      final error = DioException(
        type: DioExceptionType.badResponse,
        response: Response(
          statusCode: 500,
          requestOptions: RequestOptions(path: '/test'),
          data: {'message': 'Internal server error'},
        ),
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<ServerFailure>());
      expect((result as ServerFailure).message, contains('Internal server error'));
    });

    test('DioException with 401 response returns AuthFailure', () {
      final error = DioException(
        type: DioExceptionType.badResponse,
        response: Response(
          statusCode: 401,
          requestOptions: RequestOptions(path: '/test'),
          data: {'message': 'Unauthorized'},
        ),
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<AuthFailure>());
    });

    test('DioException with 422 response returns ValidationFailure', () {
      final error = DioException(
        type: DioExceptionType.badResponse,
        response: Response(
          statusCode: 422,
          requestOptions: RequestOptions(path: '/test'),
          data: {'message': 'Validation failed'},
        ),
        requestOptions: RequestOptions(path: '/test'),
      );
      final result = ErrorHandler.handle(error);
      expect(result, isA<ValidationFailure>());
    });

    test('generic exception returns ServerFailure', () {
      final result = ErrorHandler.handle(Exception('something broke'));
      expect(result, isA<ServerFailure>());
    });
  });
}
