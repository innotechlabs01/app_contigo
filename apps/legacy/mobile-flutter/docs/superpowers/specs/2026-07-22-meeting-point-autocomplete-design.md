# Meeting Point Autocomplete — Google Places Integration

## Overview

Replace the plain text field for "punto de encuentro" in `services_screen.dart` with a Google Places autocomplete search. Users type an address, see suggestions in a dropdown, and select one. The selected location saves as a `MeetingPoint` entity with address + coordinates (lat/lng).

**Approach:** HTTP calls to Google Places API using existing Dio client — no third-party map packages. Custom autocomplete widget matching the app's design system.

## Requirements

- **Flow:** Text input with dropdown suggestions (no interactive map, no pin placement)
- **Data captured:** Address string + latitude + longitude (+ optional place ID)
- **Provider:** Google Places Autocomplete API (free tier: 10,000 requests/month)
- **Language:** Spanish (`language=es`)
- **Country filter:** Colombia (`components=country:co`)
- **API key:** Via `--dart-define=GOOGLE_PLACES_API_KEY=xxx`

## Architecture

### Domain Layer

**New entity `MeetingPoint`:**
```
lib/features/client/domain/entities/meeting_point.dart
```
- `address` (String) — human-readable address
- `latitude` (double)
- `longitude` (double)
- `placeId` (String?) — Google Place ID for future reference

**Updated entity `ServiceRequest`:**
```
lib/features/client/domain/entities/service_request.dart
```
- Add `MeetingPoint? meetingPoint` field
- Keep existing `address` field for backward compatibility

**New repository interface `PlacesRepository`:**
```
lib/features/client/domain/repositories/places_repository.dart
```
- `Future<List<MeetingPoint>> searchPlaces(String query)`

**New use case `SearchMeetingPointsUseCase`:**
```
lib/features/client/domain/use_cases/search_meeting_points_use_case.dart
```
- Takes `String query`, returns `List<MeetingPoint>`
- Calls `PlacesRepository.searchPlaces(query)`

### Data Layer

**New datasource `GooglePlacesDatasource`:**
```
lib/features/client/data/datasources/google_places_datasource.dart
```
- Uses existing `DioClient`
- Endpoint: `https://maps.googleapis.com/maps/api/place/autocomplete/json`
- Params: `input`, `key`, `language=es`, `components=country:co`
- Returns `List<GooglePlacePrediction>`

**New model `GooglePlacePrediction`:**
```
lib/features/client/data/models/google_place_prediction.dart
```
- Freezed model with `placeId`, `description`, `types`

**New repository impl `PlacesRepositoryImpl`:**
```
lib/features/client/data/repositories/places_repository_impl.dart
```
- Implements `PlacesRepository`
- Calls `GooglePlacesDatasource.searchPlaces(query)`
- Converts predictions to `MeetingPoint` via `MeetingPointMapper`

**New mapper `MeetingPointMapper`:**
```
lib/features/client/data/mappers/meeting_point_mapper.dart
```
- `GooglePlacePrediction` -> `MeetingPoint` (requires separate Place Details call for lat/lng, OR use `Place_details` endpoint)

> **Important:** The Autocomplete API returns only predictions (no coordinates). To get lat/lng, a second call to the Place Details API is needed:
> - Endpoint: `https://maps.googleapis.com/maps/api/place/details/json`
> - Params: `place_id`, `key`, `fields=geometry`
> - Returns `location.lat` and `location.lng`

### Presentation Layer

**New widget `MeetingPointSearchWidget`:**
```
lib/features/client/presentation/widgets/meeting_point_search_widget.dart
```
- `TextFormField` with 300ms debounce
- Dropdown `ListView` below the field showing suggestions
- Loading indicator during API calls
- Error message on failure
- On selection: fills field, closes dropdown, stores `MeetingPoint` in ViewModel

**Updated ViewModel `ServicesViewModel`:**
```
lib/features/client/presentation/view_models/services_view_model.dart
```
- New state: `List<MeetingPoint> searchResults`
- New state: `MeetingPoint? selectedMeetingPoint`
- Method: `searchMeetingPoints(String query)`
- Method: `selectMeetingPoint(MeetingPoint point)`
- Method: `clearMeetingPointSearch()`

**Updated screen `services_screen.dart`:**
```
lib/features/client/presentation/screens/services_screen.dart
```
- Replace `_buildLocationSection` text field with `MeetingPointSearchWidget`
- Pass ViewModel callbacks

### Configuration

**API Key storage:**
- Build time: `--dart-define=GOOGLE_PLACES_API_KEY=xxx`
- Read: `String.fromEnvironment('GOOGLE_PLACES_API_KEY')`
- Store in `lib/core/network/api_endpoints.dart` as a constant

**Platform permissions:**
- No location permissions needed (search-only, no GPS)

**API endpoints to add in `api_endpoints.dart`:**
```
static const String googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
static const String placesAutocomplete = '/autocomplete/json';
static const String placeDetails = '/details/json';
```

## Data Flow

```
User types "Cafeteria" in meeting point field
  -> 300ms debounce
  -> SearchMeetingPointsUseCase("Cafeteria")
  -> GooglePlacesDatasource -> HTTP GET autocomplete/json
  -> Returns List<GooglePlacePrediction>
  -> UI shows dropdown with suggestions
  -> User selects "Cafeteria El Parque, Av. Principal 123"
  -> GooglePlacesDatasource -> HTTP GET details/json (place_id)
  -> Returns lat/lng
  -> MeetingPoint created with address + coordinates
  -> Stored in ServicesViewModel.selectedMeetingPoint
  -> Field shows selected address
  -> On form submit, MeetingPoint included in ServiceRequest
```

## Files to Create

| File | Purpose |
|------|---------|
| `lib/features/client/domain/entities/meeting_point.dart` | MeetingPoint entity |
| `lib/features/client/domain/repositories/places_repository.dart` | Repository interface |
| `lib/features/client/domain/use_cases/search_meeting_points_use_case.dart` | Search use case |
| `lib/features/client/data/datasources/google_places_datasource.dart` | Google Places HTTP client |
| `lib/features/client/data/models/google_place_prediction.dart` | Prediction model |
| `lib/features/client/data/repositories/places_repository_impl.dart` | Repository implementation |
| `lib/features/client/data/mappers/meeting_point_mapper.dart` | Mapper |
| `lib/features/client/presentation/widgets/meeting_point_search_widget.dart` | Autocomplete widget |

## Files to Modify

| File | Change |
|------|--------|
| `lib/core/network/api_endpoints.dart` | Add Google Places API constants |
| `lib/features/client/domain/entities/service_request.dart` | Add `MeetingPoint?` field |
| `lib/features/client/presentation/screens/services_screen.dart` | Replace text field with autocomplete |
| `lib/features/client/presentation/view_models/services_view_model.dart` | Add search state and methods |
| `pubspec.yaml` | No new dependencies needed (uses existing Dio) |

## Testing Strategy

- **Unit tests:** `SearchMeetingPointsUseCase`, `GooglePlacesDatasource`, `PlacesRepositoryImpl`
- **Widget tests:** `MeetingPointSearchWidget` (mock datasource)
- **Golden tests:** Autocomplete dropdown visual consistency

## Out of Scope

- Interactive map with pin placement
- GPS/current location detection
- Place favorites or recent searches
- Map tile rendering (no `flutter_map` or `google_maps_flutter` needed)
