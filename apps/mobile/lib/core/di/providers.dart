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

// End of providers.dart