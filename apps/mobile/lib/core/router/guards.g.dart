// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'guards.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(AuthGuard)
const authGuardProvider = AuthGuardProvider._();

final class AuthGuardProvider extends $NotifierProvider<AuthGuard, bool> {
  const AuthGuardProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'authGuardProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$authGuardHash();

  @$internal
  @override
  AuthGuard create() => AuthGuard();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(bool value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<bool>(value),
    );
  }
}

String _$authGuardHash() => r'47fefde3a38deee316c6f4aaf5318a960def40a3';

abstract class _$AuthGuard extends $Notifier<bool> {
  bool build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<bool, bool>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<bool, bool>,
              bool,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}
