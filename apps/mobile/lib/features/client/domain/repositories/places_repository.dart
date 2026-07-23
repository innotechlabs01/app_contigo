import '../entities/meeting_point.dart';

abstract class PlacesRepository {
  Future<List<MeetingPoint>> searchPlaces(String query);
}
