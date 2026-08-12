import 'package:freezed_annotation/freezed_annotation.dart';

part 'meeting_point.freezed.dart';

@freezed
sealed class MeetingPoint with _$MeetingPoint {
  const factory MeetingPoint({
    required String address,
    required double latitude,
    required double longitude,
    String? placeId,
  }) = _MeetingPoint;

  const MeetingPoint._();
}
