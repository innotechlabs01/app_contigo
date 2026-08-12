import '../entities/meeting_point.dart';
import '../repositories/places_repository.dart';

class SearchMeetingPointsUseCase {
  final PlacesRepository _repository;

  SearchMeetingPointsUseCase(this._repository);

  Future<List<MeetingPoint>> call(String query) =>
      _repository.searchPlaces(query);

  Future<MeetingPoint> getDetails(String placeId, String address) =>
      _repository.getMeetingPointDetails(placeId, address);
}
