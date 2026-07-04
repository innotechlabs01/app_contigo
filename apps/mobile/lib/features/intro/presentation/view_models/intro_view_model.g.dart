// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'intro_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

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

String _$introViewModelHash() => r'4ec7ff4333e776376a5b0927c58665435e8c21e5';

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
