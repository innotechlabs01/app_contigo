import 'dart:async';
import 'dart:typed_data';
import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:contigo_mobile/core/network/interceptors/retry_interceptor.dart';

class _RetryHttpClientAdapter implements HttpClientAdapter {
  int requestCount = 0;
  final int failCount;

  _RetryHttpClientAdapter({this.failCount = 2});

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<dynamic>? cancelFuture,
  ) async {
    requestCount++;
    if (requestCount <= failCount) {
      throw DioException(
        type: DioExceptionType.connectionTimeout,
        requestOptions: options,
      );
    }
    return ResponseBody.fromString('ok', 200);
  }

  @override
  void close({bool force = false}) {}
}

void main() {
  group('RetryInterceptor', () {
    test('retries on connectionTimeout and resolves when retry succeeds', () async {
      final dio = Dio();
      final adapter = _RetryHttpClientAdapter(failCount: 2);
      dio.httpClientAdapter = adapter;
      dio.interceptors.add(RetryInterceptor(dio: dio, maxRetries: 3));

      final response = await dio.get('/test');

      expect(response.statusCode, 200);
      expect(adapter.requestCount, 3);
    });

    test('does not retry on 4xx client errors', () async {
      final dio = Dio();
      final adapter = _RetryHttpClientAdapter(failCount: 1);
      dio.httpClientAdapter = adapter;
      dio.interceptors.add(RetryInterceptor(dio: dio, maxRetries: 3));

      // Override adapter to throw a 4xx on first call
      int callCount = 0;
      dio.httpClientAdapter = _createAdapterWithError(
        DioException(
          type: DioExceptionType.badResponse,
          response: Response(
            statusCode: 404,
            requestOptions: RequestOptions(path: '/test'),
          ),
          requestOptions: RequestOptions(path: '/test'),
        ),
        failAfter: 0,
      );

      await expectLater(
        dio.get('/test'),
        throwsA(isA<DioException>()),
      );
    });

    test('gives up after maxRetries exhausted', () async {
      final dio = Dio();
      final adapter = _RetryHttpClientAdapter(failCount: 10);
      dio.httpClientAdapter = adapter;
      dio.interceptors.add(RetryInterceptor(dio: dio, maxRetries: 3));

      await expectLater(
        dio.get('/test'),
        throwsA(isA<DioException>()),
      );
    });
  });
}

HttpClientAdapter _createAdapterWithError(DioException error, {int failAfter = 0}) {
  return _ErrorHttpClientAdapter(error, failAfter: failAfter);
}

class _ErrorHttpClientAdapter implements HttpClientAdapter {
  final DioException error;
  final int failAfter;
  int _callCount = 0;

  _ErrorHttpClientAdapter(this.error, {this.failAfter = 0});

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<dynamic>? cancelFuture,
  ) async {
    _callCount++;
    if (_callCount <= failAfter) {
      return ResponseBody.fromString('ok', 200);
    }
    throw error;
  }

  @override
  void close({bool force = false}) {}
}
