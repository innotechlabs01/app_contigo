import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:mocktail/mocktail.dart';
import 'package:contigo_mobile/core/network/interceptors/logging_interceptor.dart';

class MockRequestInterceptorHandler extends Mock implements RequestInterceptorHandler {}
class MockResponseInterceptorHandler extends Mock implements ResponseInterceptorHandler {}
class MockErrorInterceptorHandler extends Mock implements ErrorInterceptorHandler {}

void main() {
  group('LoggingInterceptor', () {
    late LoggingInterceptor interceptor;

    setUp(() {
      interceptor = LoggingInterceptor();
    });

    test('passes through requests', () {
      final handler = MockRequestInterceptorHandler();
      final options = RequestOptions(path: '/test');

      interceptor.onRequest(options, handler);

      verify(() => handler.next(options)).called(1);
    });

    test('passes through responses', () {
      final handler = MockResponseInterceptorHandler();
      final response = Response(
        requestOptions: RequestOptions(path: '/test'),
        statusCode: 200,
      );

      interceptor.onResponse(response, handler);

      verify(() => handler.next(response)).called(1);
    });

    test('passes through errors', () {
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
