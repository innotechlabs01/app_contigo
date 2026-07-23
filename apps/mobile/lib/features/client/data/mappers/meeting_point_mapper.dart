import '../../domain/entities/meeting_point.dart';
import '../models/google_place_prediction.dart';

class MeetingPointMapper {
  static MeetingPoint fromPrediction(
    GooglePlacePrediction prediction,
  ) {
    return MeetingPoint(
      address: prediction.description,
      latitude: 0,
      longitude: 0,
      placeId: prediction.placeId,
    );
  }
}
