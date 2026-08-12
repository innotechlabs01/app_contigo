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
    return predictions
        .map(
          (p) => MeetingPointMapper.fromPrediction(p),
        )
        .toList();
  }

  @override
  Future<MeetingPoint> getMeetingPointDetails(
    String placeId,
    String address,
  ) async {
    final details = await _datasource.getPlaceDetails(placeId);
    return MeetingPoint(
      address: address,
      latitude: details.latitude,
      longitude: details.longitude,
      placeId: placeId,
    );
  }
}
