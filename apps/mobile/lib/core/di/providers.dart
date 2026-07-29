import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import '../../core/network/dio_client.dart';
import '../../core/network/interceptors/auth_interceptor.dart';
import '../../core/network/interceptors/connectivity_service.dart';
import '../../core/storage/preferences_service.dart';
import '../../core/storage/secure_storage_service.dart';
import '../../core/ws/ws_provider.dart';
import '../client/data/datasources/request_api_datasource.dart';
import '../client/data/repositories/request_repository_impl.dart';
import '../client/domain/repositories/request_repository.dart';
import '../client/presentation/view_models/client_requests_view_model.dart';
import '../companion/presentation/view_models/companion_requests_view_model.dart';

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

@riverpod
WebSocketConnection webSocketConnection(Ref ref) =>
    WebSocketConnection();

@riverpod
RequestApiDatasource requestApiDatasource(Ref ref) =>
    RequestApiDatasource();

@riverpod
RequestRepositoryImpl requestRepository(Ref ref) {
  final datasource = ref.read(requestApiDatasourceProvider);
  return RequestRepositoryImpl(datasource);
}

@riverpod
AuthStateNotifier authState(Ref ref) => AuthStateNotifier();

@riverpod
IntroStatusNotifier introStatus(Ref ref) => IntroStatusNotifier();

@riverpod
class ClientRequestsViewModel extends _$ClientRequestsViewModel {
  @override
  Future<List<ServiceRequest>> build() async {
    final repo = ref.read(clientRequestRepositoryProvider);
    final ws = ref.read(webSocketConnectionProvider);

    _wsSub = ws.events.listen((event) {
      if (event is RequestAccepted || event is RequestRejected) {
        ref.invalidateSelf();
      }
    });

    ref.onDispose(() => _wsSub?.cancel());
    return repo.getMyRequests();
  }

  StreamSubscription? _wsSub;
}

@riverpod
RequestRepository clientRequestRepository(Ref ref) {
  final datasource = ref.read(requestApiDatasourceProvider);
  return RequestRepositoryImpl(datasource);
}

@riverpod
class CompanionRequestsViewModel extends _$CompanionRequestsViewModel {
  @override
  Future<List<ServiceRequest>> build() async {
    final repo = ref.read(requestRepositoryProvider);
    final ws = ref.read(webSocketConnectionProvider);

    _wsSub = ws.events.listen((event) {
      if (event is RequestPending || event is RequestAccepted || event is RequestRejected) {
        ref.invalidateSelf();
      }
    });

    ref.onDispose(() => _wsSub?.cancel());
    return repo.getCompanionRequests();
  }

  StreamSubscription? _wsSub;
}

@riverpod
RequestRepository requestRepository(Ref ref) {
  final datasource = ref.read(requestApiDatasourceProvider);
  return RequestRepositoryImpl(datasource);
}

@riverpod
class RequestAction extends _$RequestAction {
  @override
  AsyncValue<void> build() => const AsyncValue.data(null);

  Future<ServiceRequest> accept(String requestId) async {
    state = const AsyncLoading();
    try {
      final repo = ref.read(requestRepositoryProvider);
      final result = await repo.acceptRequest(requestId);
      state = const AsyncValue.data(null);
      return result;
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<ServiceRequest> reject(String requestId) async {
    state = const AsyncLoading();
    try {
      final repo = ref.read(requestRepositoryProvider);
      final result = await repo.rejectRequest(requestId);
      state = const AsyncValue.data(null);
      return result;
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }
}

// TODO: Add these missing providers after the view models that use them
