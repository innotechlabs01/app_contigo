abstract class ApiEndpoints {
  static const String baseUrl = 'https://contigo.app/api';
  static const String requests = '/requests';
  static const String checkId = '/requests/check-id';
  static const String questionnaires = '/questionnaires';
  static const String companion = '/companion';
  static const String earnings = '/companion/earnings';
  static const String sessions = '/companion/sessions';
  static const String profile = '/profile';

  static const String placesLanguage = 'es';
  static const String placesCountry = 'country:co';

  static const String googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
  static const String placesAutocompletePath = '/autocomplete/json';
  static const String placeDetailsPath = '/details/json';
  static String get googlePlacesApiKey => const String.fromEnvironment('GOOGLE_PLACES_API_KEY');
}
