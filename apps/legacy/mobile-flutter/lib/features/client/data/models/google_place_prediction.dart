import 'package:freezed_annotation/freezed_annotation.dart';

part 'google_place_prediction.freezed.dart';
part 'google_place_prediction.g.dart';

@freezed
sealed class GooglePlacePrediction with _$GooglePlacePrediction {
  const factory GooglePlacePrediction({
    @JsonKey(name: 'place_id') required String placeId,
    required String description,
    @Default([]) List<String> types,
  }) = _GooglePlacePrediction;

  factory GooglePlacePrediction.fromJson(Map<String, dynamic> json) =>
      _$GooglePlacePredictionFromJson(json);
}
