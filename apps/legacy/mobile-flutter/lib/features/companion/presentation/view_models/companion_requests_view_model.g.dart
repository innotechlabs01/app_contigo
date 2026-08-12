// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'companion_requests_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(CompanionRequestsList)
const companionRequestsListProvider = CompanionRequestsListProvider._();

final class CompanionRequestsListProvider
    extends
        $AsyncNotifierProvider<CompanionRequestsList, List<ServiceRequest>> {
  const CompanionRequestsListProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'companionRequestsListProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$companionRequestsListHash();

  @$internal
  @override
  CompanionRequestsList create() => CompanionRequestsList();
}

String _$companionRequestsListHash() =>
    r'19396e85d3f3e5ecc99638dbcdcbd16b83f463f6';

abstract class _$CompanionRequestsList
    extends $AsyncNotifier<List<ServiceRequest>> {
  FutureOr<List<ServiceRequest>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref =
        this.ref
            as $Ref<AsyncValue<List<ServiceRequest>>, List<ServiceRequest>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<
                AsyncValue<List<ServiceRequest>>,
                List<ServiceRequest>
              >,
              AsyncValue<List<ServiceRequest>>,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}

@ProviderFor(RequestAction)
const requestActionProvider = RequestActionProvider._();

final class RequestActionProvider
    extends $NotifierProvider<RequestAction, AsyncValue<void>> {
  const RequestActionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'requestActionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$requestActionHash();

  @$internal
  @override
  RequestAction create() => RequestAction();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AsyncValue<void> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AsyncValue<void>>(value),
    );
  }
}

String _$requestActionHash() => r'a71004d5b6a983db05c429674c951e6f513a4055';

abstract class _$RequestAction extends $Notifier<AsyncValue<void>> {
  AsyncValue<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<AsyncValue<void>, AsyncValue<void>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, AsyncValue<void>>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}
