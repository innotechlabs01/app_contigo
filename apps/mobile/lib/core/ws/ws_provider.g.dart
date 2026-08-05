// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ws_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(WebSocketConnection)
const webSocketConnectionProvider = WebSocketConnectionProvider._();

final class WebSocketConnectionProvider
    extends $NotifierProvider<WebSocketConnection, AsyncValue<void>> {
  const WebSocketConnectionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'webSocketConnectionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$webSocketConnectionHash();

  @$internal
  @override
  WebSocketConnection create() => WebSocketConnection();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AsyncValue<void> value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AsyncValue<void>>(value),
    );
  }
}

String _$webSocketConnectionHash() =>
    r'f10221254ddafdd5de8374df2f7c06b9d58c4459';

abstract class _$WebSocketConnection extends $Notifier<AsyncValue<void>> {
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
