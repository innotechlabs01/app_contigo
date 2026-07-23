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

    try {
      final response = await _dio.get(
        '${ApiEndpoints.googlePlacesBaseUrl}${ApiEndpoints.placesAutocompletePath}',
        queryParameters: {
          'input': query,
          'key': ApiEndpoints.googlePlacesApiKey,
          'language': ApiEndpoints.placesLanguage,
          'components': ApiEndpoints.placesCountry,
        },
      );

      final predictions = response.data['predictions'] as List<dynamic>? ?? [];
      return predictions
          .map((p) => GooglePlacePrediction.fromJson(p as Map<String, dynamic>))
          .toList();
    } on DioException {
      return [];
    }
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
        'language': ApiEndpoints.placesLanguage,
      },
    );

    final status = response.data['status'] as String?;
    if (status != 'OK') {
      throw Exception('Google Places details failed: $status');
    }

    final location =
        response.data['result']['geometry']['location'] as Map<String, dynamic>;
    return (
      latitude: location['lat'] as double,
      longitude: location['lng'] as double,
    );
  }
}
