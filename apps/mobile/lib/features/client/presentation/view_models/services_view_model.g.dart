// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'services_view_model.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(serviceRepository)
const serviceRepositoryProvider = ServiceRepositoryProvider._();

final class ServiceRepositoryProvider
    extends
        $FunctionalProvider<
          ServiceRepository,
          ServiceRepository,
          ServiceRepository
        >
    with $Provider<ServiceRepository> {
  const ServiceRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'serviceRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$serviceRepositoryHash();

  @$internal
  @override
  $ProviderElement<ServiceRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  ServiceRepository create(Ref ref) {
    return serviceRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ServiceRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ServiceRepository>(value),
    );
  }
}

String _$serviceRepositoryHash() => r'b068ae6ea4a33ba2e5e38f2f9170260345b76be3';

@ProviderFor(servicesList)
const servicesListProvider = ServicesListProvider._();

final class ServicesListProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<ServiceType>>,
          List<ServiceType>,
          FutureOr<List<ServiceType>>
        >
    with
        $FutureModifier<List<ServiceType>>,
        $FutureProvider<List<ServiceType>> {
  const ServicesListProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'servicesListProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$servicesListHash();

  @$internal
  @override
  $FutureProviderElement<List<ServiceType>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<ServiceType>> create(Ref ref) {
    return servicesList(ref);
  }
}

String _$servicesListHash() => r'780e7b44a9f197223b09e9e366b0fe55fb893061';
