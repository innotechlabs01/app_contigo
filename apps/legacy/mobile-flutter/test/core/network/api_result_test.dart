import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/core/network/api_result.dart';

void main() {
  group('ApiResult', () {
    test('success should return data', () {
      const result = ApiResult<String>.success('data');
      expect(result.when(success: (d) => d, failure: (f) => null), 'data');
    });

    test('failure should return error', () {
      final result = ApiResult<String>.failure(ServerFailure('error'));
      expect(result.when(success: (d) => null, failure: (f) => f.message), 'error');
    });

    test('isSuccess returns true for success', () {
      const result = ApiResult<String>.success('ok');
      expect(result.isSuccess, isTrue);
    });

    test('isFailure returns true for failure', () {
      final result = ApiResult<String>.failure(ServerFailure('fail'));
      expect(result.isFailure, isTrue);
    });

    test('ServerFailure stores message and code', () {
      final failure = ServerFailure('not found', code: '404');
      expect(failure.message, 'not found');
      expect(failure.code, '404');
    });

    test('NetworkFailure stores message', () {
      final failure = NetworkFailure('no connection');
      expect(failure.message, 'no connection');
    });

    test('AuthFailure has default message', () {
      final failure = AuthFailure();
      expect(failure.message, 'Authentication required');
    });

    test('ValidationFailure stores message and optional errors map', () {
      final failure = ValidationFailure('invalid', errors: {'field': 'required'});
      expect(failure.message, 'invalid');
      expect(failure.errors, {'field': 'required'});
    });
  });
}
