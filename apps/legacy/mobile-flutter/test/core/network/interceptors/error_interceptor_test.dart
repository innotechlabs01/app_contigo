import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:mocktail/mocktail.dart';
import 'package:contigo_mobile/core/network/interceptors/error_interceptor.dart';

class MockErrorInterceptorHandler extends Mock implements ErrorInterceptorHandler {}

void main() {
  group('ErrorInterceptor', () {
    late ErrorInterceptor interceptor;

    setUp(() {
      interceptor = ErrorInterceptor();
    });

    test('passes through DioException errors', () {
      final handler = MockErrorInterceptorHandler();
      final error = DioException(
        type: DioExceptionType.badResponse,
        response: Response(
          statusCode: 500,
          requestOptions: RequestOptions(path: '/test'),
          data: {'message': 'Server error'},
        ),
        requestOptions: RequestOptions(path: '/test'),
      );

      interceptor.onError(error, handler);

      verify(() => handler.next(error)).called(1);
    });

    test('passes through connection errors', () {
      final handler = MockErrorInterceptorHandler();
      final error = DioException(
        type: DioExceptionType.connectionTimeout,
        requestOptions: RequestOptions(path: '/test'),
      );

      interceptor.onError(error, handler);

      verify(() => handler.next(error)).called(1);
    });
  });
}
