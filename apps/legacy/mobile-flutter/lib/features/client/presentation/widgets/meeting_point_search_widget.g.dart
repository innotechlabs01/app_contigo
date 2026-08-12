// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'meeting_point_search_widget.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(searchMeetingPointsUseCase)
const searchMeetingPointsUseCaseProvider =
    SearchMeetingPointsUseCaseProvider._();

final class SearchMeetingPointsUseCaseProvider
    extends
        $FunctionalProvider<
          SearchMeetingPointsUseCase,
          SearchMeetingPointsUseCase,
          SearchMeetingPointsUseCase
        >
    with $Provider<SearchMeetingPointsUseCase> {
  const SearchMeetingPointsUseCaseProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'searchMeetingPointsUseCaseProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$searchMeetingPointsUseCaseHash();

  @$internal
  @override
  $ProviderElement<SearchMeetingPointsUseCase> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  SearchMeetingPointsUseCase create(Ref ref) {
    return searchMeetingPointsUseCase(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SearchMeetingPointsUseCase value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SearchMeetingPointsUseCase>(value),
    );
  }
}

String _$searchMeetingPointsUseCaseHash() =>
    r'cba7f5f1ff1b7c1c99ff5c942015cefabd9f112b';
