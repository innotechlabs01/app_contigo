// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'intro_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(introStatus)
const introStatusProvider = IntroStatusProvider._();

final class IntroStatusProvider extends $FunctionalProvider<bool, bool, bool>
    with $Provider<bool> {
  const IntroStatusProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'introStatusProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$introStatusHash();

  @$internal
  @override
  $ProviderElement<bool> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  bool create(Ref ref) {
    return introStatus(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(bool value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<bool>(value),
    );
  }
}

String _$introStatusHash() => r'13f2832b4a56ce1a9fef08cb66bd3c1a9ee31af5';

@ProviderFor(IntroViewModel)
const introViewModelProvider = IntroViewModelProvider._();

final class IntroViewModelProvider
    extends $NotifierProvider<IntroViewModel, int> {
  const IntroViewModelProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'introViewModelProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$introViewModelHash();

  @$internal
  @override
  IntroViewModel create() => IntroViewModel();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(int value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<int>(value),
    );
  }
}

String _$introViewModelHash() => r'da01bbb49e4adb651274fb0f451eebe53c892179';

abstract class _$IntroViewModel extends $Notifier<int> {
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
