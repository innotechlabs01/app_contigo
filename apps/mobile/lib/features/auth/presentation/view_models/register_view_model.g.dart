// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(RegisterStep)
const registerStepProvider = RegisterStepProvider._();

final class RegisterStepProvider extends $NotifierProvider<RegisterStep, int> {
  const RegisterStepProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'registerStepProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$registerStepHash();

  @$internal
  @override
  RegisterStep create() => RegisterStep();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(int value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<int>(value),
    );
  }
}

String _$registerStepHash() => r'2ee6af54ad3dc3ca2dfb03b4d5144026e1aa7d27';

abstract class _$RegisterStep extends $Notifier<int> {
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

@ProviderFor(RegisterFormDataState)
const registerFormDataStateProvider = RegisterFormDataStateProvider._();

final class RegisterFormDataStateProvider
    extends $NotifierProvider<RegisterFormDataState, RegisterFormData> {
  const RegisterFormDataStateProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'registerFormDataStateProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$registerFormDataStateHash();

  @$internal
  @override
  RegisterFormDataState create() => RegisterFormDataState();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RegisterFormData value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<RegisterFormData>(value),
    );
  }
}

String _$registerFormDataStateHash() =>
    r'cc9e290795f06445dce21a326117ea06801db248';

abstract class _$RegisterFormDataState extends $Notifier<RegisterFormData> {
  RegisterFormData build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<RegisterFormData, RegisterFormData>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<RegisterFormData, RegisterFormData>,
              RegisterFormData,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}

@ProviderFor(RegisterSubmission)
const registerSubmissionProvider = RegisterSubmissionProvider._();

final class RegisterSubmissionProvider
    extends $NotifierProvider<RegisterSubmission, AsyncValue<ServiceRequest?>> {
  const RegisterSubmissionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'registerSubmissionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$registerSubmissionHash();

  @$internal
  @override
  RegisterSubmission create() => RegisterSubmission();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AsyncValue<ServiceRequest?> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AsyncValue<ServiceRequest?>>(value),
    );
  }
}

String _$registerSubmissionHash() =>
    r'c9aeea5b3eb4ecaaf6224ff88818bd1ce81ee7c0';

abstract class _$RegisterSubmission
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
