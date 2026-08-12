// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_place_prediction.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_GooglePlacePrediction _$GooglePlacePredictionFromJson(
  Map<String, dynamic> json,
) => _GooglePlacePrediction(
  placeId: json['place_id'] as String,
  description: json['description'] as String,
  types:
      (json['types'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
);

Map<String, dynamic> _$GooglePlacePredictionToJson(
  _GooglePlacePrediction instance,
) => <String, dynamic>{
  'place_id': instance.placeId,
  'description': instance.description,
  'types': instance.types,
};
