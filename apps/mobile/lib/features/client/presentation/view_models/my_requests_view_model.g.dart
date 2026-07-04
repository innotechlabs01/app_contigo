// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'my_requests_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(myRequestsList)
const myRequestsListProvider = MyRequestsListProvider._();

final class MyRequestsListProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<ServiceRequest>>,
          List<ServiceRequest>,
          FutureOr<List<ServiceRequest>>
        >
    with
        $FutureModifier<List<ServiceRequest>>,
        $FutureProvider<List<ServiceRequest>> {
  const MyRequestsListProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'myRequestsListProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$myRequestsListHash();

  @$internal
  @override
  $FutureProviderElement<List<ServiceRequest>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<ServiceRequest>> create(Ref ref) {
    return myRequestsList(ref);
  }
}

String _$myRequestsListHash() => r'8612b59aa442b8827292efe5cf60b62ab5c90fe9';

@ProviderFor(MyRequestsFilter)
const myRequestsFilterProvider = MyRequestsFilterProvider._();

final class MyRequestsFilterProvider
    extends $NotifierProvider<MyRequestsFilter, String?> {
  const MyRequestsFilterProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'myRequestsFilterProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$myRequestsFilterHash();

  @$internal
  @override
  MyRequestsFilter create() => MyRequestsFilter();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(String? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<String?>(value),
    );
  }
}

String _$myRequestsFilterHash() => r'960a4a55c82dc549e10197d55c9cb5868f06850b';

abstract class _$MyRequestsFilter extends $Notifier<String?> {
  String? build();
  @$mustCallSuper
  @override
  void runBuild() {
    final created = build();
    final ref = this.ref as $Ref<String?, String?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<String?, String?>,
              String?,
              Object?,
              Object?
            >;
    element.handleValue(ref, created);
  }
}
