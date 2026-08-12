import 'dart:async';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../client/domain/entities/service_request.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/ws/ws_provider.dart';
import '../../../../core/ws/ws_event.dart';

part 'companion_requests_view_model.g.dart';

@riverpod
class CompanionRequestsList extends _$CompanionRequestsList {
  StreamSubscription? _wsSub;

  @override
  Future<List<ServiceRequest>> build() async {
    final repo = ref.read(requestRepositoryProvider);
    final ws = ref.read(webSocketConnectionProvider.notifier);

    _wsSub = ws.events.listen((event) {
      if (event is RequestCreated || event is RequestAccepted || event is RequestRejected) {
        ref.invalidateSelf();
      }
    });

    ref.onDispose(() => _wsSub?.cancel());
    return repo.getPendingRequests();
  }
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
