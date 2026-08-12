// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'companions_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(companions)
const companionsProvider = CompanionsProvider._();

final class CompanionsProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<Companion>>,
          List<Companion>,
          FutureOr<List<Companion>>
        >
    with $FutureModifier<List<Companion>>, $FutureProvider<List<Companion>> {
  const CompanionsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'companionsProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$companionsHash();

  @$internal
  @override
  $FutureProviderElement<List<Companion>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<Companion>> create(Ref ref) {
    return companions(ref);
  }
}

String _$companionsHash() => r'e8456c3d44e57f869b2d646d41d6ed978de28aa0';
