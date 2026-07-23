import '../../domain/entities/meeting_point.dart';
import '../models/google_place_prediction.dart';

class MeetingPointMapper {
  static MeetingPoint fromPrediction(
    GooglePlacePrediction prediction, {
    required double latitude,
    required double longitude,
  }) {
    return MeetingPoint(
      address: prediction.description,
      latitude: latitude,
      longitude: longitude,
      placeId: prediction.placeId,
    );
  }
}
