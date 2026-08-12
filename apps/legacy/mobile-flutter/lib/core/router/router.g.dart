// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'router.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(routerRefreshNotifier)
const routerRefreshProvider = RouterRefreshNotifierProvider._();

final class RouterRefreshNotifierProvider
    extends
        $FunctionalProvider<
          RouterRefreshNotifier,
          RouterRefreshNotifier,
          RouterRefreshNotifier
        >
    with $Provider<RouterRefreshNotifier> {
  const RouterRefreshNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'routerRefreshProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$routerRefreshNotifierHash();

  @$internal
  @override
  $ProviderElement<RouterRefreshNotifier> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  RouterRefreshNotifier create(Ref ref) {
    return routerRefreshNotifier(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RouterRefreshNotifier value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<RouterRefreshNotifier>(value),
    );
  }
}

String _$routerRefreshNotifierHash() =>
    r'de5e3fd704ba41a903b18086a79afff912ddcb31';

@ProviderFor(router)
const routerProvider = RouterProvider._();

final class RouterProvider
    extends $FunctionalProvider<GoRouter, GoRouter, GoRouter>
    with $Provider<GoRouter> {
  const RouterProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'routerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$routerHash();

  @$internal
  @override
  $ProviderElement<GoRouter> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  GoRouter create(Ref ref) {
    return router(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(GoRouter value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<GoRouter>(value),
    );
  }
}

String _$routerHash() => r'0a7d8f0800335d49e580a905b7c71875cd92a229';
