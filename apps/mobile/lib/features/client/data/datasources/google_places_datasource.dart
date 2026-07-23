import 'package:dio/dio.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/google_place_prediction.dart';

class GooglePlacesDatasource {
  final Dio _dio;

  GooglePlacesDatasource(this._dio);

  Future<List<GooglePlacePrediction>> getAutocompleteSuggestions(
    String query,
  ) async {
    if (query.trim().isEmpty) return [];

    final response = await _dio.get(
      '${ApiEndpoints.googlePlacesBaseUrl}${ApiEndpoints.placesAutocompletePath}',
      queryParameters: {
        'input': query,
        'key': ApiEndpoints.googlePlacesApiKey,
        'language': 'es',
        'components': 'country:co',
      },
    );

    final predictions = response.data['predictions'] as List<dynamic>? ?? [];
    return predictions
        .map((p) => GooglePlacePrediction.fromJson(p as Map<String, dynamic>))
        .toList();
  }

  Future<({double latitude, double longitude})> getPlaceDetails(
    String placeId,
  ) async {
    final response = await _dio.get(
      '${ApiEndpoints.googlePlacesBaseUrl}${ApiEndpoints.placeDetailsPath}',
      queryParameters: {
        'place_id': placeId,
        'key': ApiEndpoints.googlePlacesApiKey,
        'fields': 'geometry',
        'language': 'es',
      },
    );

    final location =
        response.data['result']['geometry']['location'] as Map<String, dynamic>;
    return (
      latitude: location['lat'] as double,
      longitude: location['lng'] as double,
    );
  }
}
