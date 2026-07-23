import '../../domain/entities/meeting_point.dart';
import '../../domain/repositories/places_repository.dart';
import '../datasources/google_places_datasource.dart';
import '../mappers/meeting_point_mapper.dart';

class PlacesRepositoryImpl implements PlacesRepository {
  final GooglePlacesDatasource _datasource;

  PlacesRepositoryImpl(this._datasource);

  @override
  Future<List<MeetingPoint>> searchPlaces(String query) async {
    final predictions = await _datasource.getAutocompleteSuggestions(query);

    final meetingPoints = <MeetingPoint>[];
    for (final prediction in predictions) {
      try {
        final details = await _datasource.getPlaceDetails(prediction.placeId);
        meetingPoints.add(
          MeetingPointMapper.fromPrediction(
            prediction,
            latitude: details.latitude,
            longitude: details.longitude,
          ),
        );
      } catch (_) {
        // Skip predictions where details fetch fails
      }
    }
    return meetingPoints;
  }
}
