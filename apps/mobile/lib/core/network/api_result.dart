import 'package:freezed_annotation/freezed_annotation.dart';

part 'api_result.freezed.dart';

@freezed
sealed class ApiResult<T> with _$ApiResult<T> {
  const factory ApiResult.success(T data) = Success<T>;
  const factory ApiResult.failure(Failure error) = _Failure<T>;

  const ApiResult._();

  bool get isSuccess => this is Success<T>;
  bool get isFailure => this is _Failure<T>;
}

abstract class Failure {
  String get message;
  String? get code;

  const Failure();
}

class ServerFailure extends Failure {
  @override
  final String message;
  @override
  final String? code;

  const ServerFailure(this.message, {this.code});

  @override
  String toString() => 'ServerFailure: $message (code: $code)';
}

class NetworkFailure extends Failure {
  @override
  final String message;
  @override
  final String? code;

  const NetworkFailure(this.message, {this.code});

  @override
  String toString() => 'NetworkFailure: $message';
}

class AuthFailure extends Failure {
  @override
  final String message;
  @override
  final String? code;

  const AuthFailure([this.message = 'Authentication required', this.code]);

  @override
  String toString() => 'AuthFailure: $message';
}

class ValidationFailure extends Failure {
  @override
  final String message;
  @override
  final String? code;
  final Map<String, String>? errors;

  const ValidationFailure(this.message, {this.code, this.errors});

  @override
  String toString() => 'ValidationFailure: $message';
}
