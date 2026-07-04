// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'request_form_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(requestRepository)
const requestRepositoryProvider = RequestRepositoryProvider._();

final class RequestRepositoryProvider
    extends
        $FunctionalProvider<
          RequestRepository,
          RequestRepository,
          RequestRepository
        >
    with $Provider<RequestRepository> {
  const RequestRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'requestRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$requestRepositoryHash();

  @$internal
  @override
  $ProviderElement<RequestRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  RequestRepository create(Ref ref) {
    return requestRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RequestRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<RequestRepository>(value),
    );
  }
}

String _$requestRepositoryHash() => r'8452738e710c8edd38edbb913a20379defcd2f44';

@ProviderFor(RequestFormStep)
const requestFormStepProvider = RequestFormStepProvider._();

final class RequestFormStepProvider
    extends $NotifierProvider<RequestFormStep, int> {
  const RequestFormStepProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'requestFormStepProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$requestFormStepHash();

  @$internal
  @override
  RequestFormStep create() => RequestFormStep();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(int value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<int>(value),
    );
  }
}

String _$requestFormStepHash() => r'cbff574f204865cf2e41ac7e11b976c622ab65ca';

abstract class _$RequestFormStep extends $Notifier<int> {
  int build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<int, int>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<int, int>,
              int,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}

@ProviderFor(RequestFormDataState)
const requestFormDataStateProvider = RequestFormDataStateProvider._();

final class RequestFormDataStateProvider
    extends $NotifierProvider<RequestFormDataState, RequestFormData> {
  const RequestFormDataStateProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'requestFormDataStateProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$requestFormDataStateHash();

  @$internal
  @override
  RequestFormDataState create() => RequestFormDataState();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RequestFormData value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<RequestFormData>(value),
    );
  }
}

String _$requestFormDataStateHash() =>
    r'22a966af4f05739a31ac7f472fa0c5478a211259';

abstract class _$RequestFormDataState extends $Notifier<RequestFormData> {
  RequestFormData build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<RequestFormData, RequestFormData>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<RequestFormData, RequestFormData>,
              RequestFormData,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}

@ProviderFor(RequestSubmission)
const requestSubmissionProvider = RequestSubmissionProvider._();

final class RequestSubmissionProvider
    extends $NotifierProvider<RequestSubmission, AsyncValue<ServiceRequest?>> {
  const RequestSubmissionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'requestSubmissionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$requestSubmissionHash();

  @$internal
  @override
  RequestSubmission create() => RequestSubmission();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AsyncValue<ServiceRequest?> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AsyncValue<ServiceRequest?>>(value),
    );
  }
}

String _$requestSubmissionHash() => r'9ca4544245548901f496e07e13ed8b61b0b74db5';

abstract class _$RequestSubmission
    extends $Notifier<AsyncValue<ServiceRequest?>> {
  AsyncValue<ServiceRequest?> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref =
        this.ref
            as $Ref<AsyncValue<ServiceRequest?>, AsyncValue<ServiceRequest?>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<
                AsyncValue<ServiceRequest?>,
                AsyncValue<ServiceRequest?>
              >,
              AsyncValue<ServiceRequest?>,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}
