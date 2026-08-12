# Meeting Point Google Places Autocomplete — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain text meeting point field in `services_screen.dart` with a Google Places autocomplete search that captures address + coordinates.

**Architecture:** HTTP calls to Google Places Autocomplete + Place Details APIs using existing Dio client. Custom `MeetingPointSearchWidget` with debounced text input and dropdown suggestions. Follows existing Clean Architecture patterns (domain/data/presentation layers).

**Tech Stack:** Dart, Flutter, Dio (existing), Riverpod 3.x (existing), Freezed (for new entity)

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `lib/features/client/domain/entities/meeting_point.dart` | MeetingPoint entity |
| Create | `lib/features/client/domain/repositories/places_repository.dart` | Repository interface |
| Create | `lib/features/client/domain/use_cases/search_meeting_points_use_case.dart` | Search use case |
| Create | `lib/features/client/data/models/google_place_prediction.dart` | API response model |
| Create | `lib/features/client/data/datasources/google_places_datasource.dart` | Google Places HTTP client |
| Create | `lib/features/client/data/mappers/meeting_point_mapper.dart` | Prediction -> MeetingPoint mapper |
| Create | `lib/features/client/data/repositories/places_repository_impl.dart` | Repository implementation |
| Create | `lib/features/client/presentation/widgets/meeting_point_search_widget.dart` | Autocomplete UI widget |
| Modify | `lib/core/network/api_endpoints.dart` | Add Google Places API constants |
| Modify | `lib/features/client/domain/entities/service_request.dart` | Add MeetingPoint field |
| Modify | `lib/features/client/presentation/screens/services_screen.dart` | Replace text field with autocomplete |

---

### Task 1: MeetingPoint Entity + API Endpoints

**Files:**
- Create: `lib/features/client/domain/entities/meeting_point.dart`
- Modify: `lib/core/network/api_endpoints.dart`

- [ ] **Step 1: Create MeetingPoint entity**

```dart
// lib/features/client/domain/entities/meeting_point.dart
class MeetingPoint {
  final String address;
  final double latitude;
  final double longitude;
  final String? placeId;

  const MeetingPoint({
    required this.address,
    required this.latitude,
    required this.longitude,
    this.placeId,
  });
}
```

- [ ] **Step 2: Add Google Places API constants to ApiEndpoints**

Add these constants to `lib/core/network/api_endpoints.dart`:

```dart
abstract class ApiEndpoints {
  // ... existing constants ...

  static const String googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
  static const String placesAutocompletePath = '/autocomplete/json';
  static const String placeDetailsPath = '/details/json';
  static String get googlePlacesApiKey => const String.fromEnvironment('GOOGLE_PLACES_API_KEY');
}
```

- [ ] **Step 3: Run analysis to verify no errors**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/domain/entities/meeting_point.dart lib/core/network/api_endpoints.dart`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/features/client/domain/entities/meeting_point.dart lib/core/network/api_endpoints.dart
git commit -m "feat: add MeetingPoint entity and Google Places API endpoints"
```

---

### Task 2: GooglePlacePrediction Model

**Files:**
- Create: `lib/features/client/data/models/google_place_prediction.dart`

- [ ] **Step 1: Create GooglePlacePrediction model**

```dart
// lib/features/client/data/models/google_place_prediction.dart
class GooglePlacePrediction {
  final String placeId;
  final String description;
  final List<String> types;

  const GooglePlacePrediction({
    required this.placeId,
    required this.description,
    required this.types,
  });

  factory GooglePlacePrediction.fromJson(Map<String, dynamic> json) {
    return GooglePlacePrediction(
      placeId: json['place_id'] as String? ?? '',
      description: json['description'] as String? ?? '',
      types: (json['types'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }
}
```

- [ ] **Step 2: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/data/models/google_place_prediction.dart`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/features/client/data/models/google_place_prediction.dart
git commit -m "feat: add GooglePlacePrediction model"
```

---

### Task 3: PlacesRepository Interface + Use Case

**Files:**
- Create: `lib/features/client/domain/repositories/places_repository.dart`
- Create: `lib/features/client/domain/use_cases/search_meeting_points_use_case.dart`

- [ ] **Step 1: Create PlacesRepository interface**

```dart
// lib/features/client/domain/repositories/places_repository.dart
import '../entities/meeting_point.dart';

abstract class PlacesRepository {
  Future<List<MeetingPoint>> searchPlaces(String query);
}
```

- [ ] **Step 2: Create SearchMeetingPointsUseCase**

```dart
// lib/features/client/domain/use_cases/search_meeting_points_use_case.dart
import '../entities/meeting_point.dart';
import '../repositories/places_repository.dart';

class SearchMeetingPointsUseCase {
  final PlacesRepository _repository;

  SearchMeetingPointsUseCase(this._repository);

  Future<List<MeetingPoint>> call(String query) =>
      _repository.searchPlaces(query);
}
```

- [ ] **Step 3: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/domain/repositories/places_repository.dart lib/features/client/domain/use_cases/search_meeting_points_use_case.dart`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/features/client/domain/repositories/places_repository.dart lib/features/client/domain/use_cases/search_meeting_points_use_case.dart
git commit -m "feat: add PlacesRepository interface and SearchMeetingPointsUseCase"
```

---

### Task 4: GooglePlacesDatasource

**Files:**
- Create: `lib/features/client/data/datasources/google_places_datasource.dart`

- [ ] **Step 1: Create GooglePlacesDatasource**

```dart
// lib/features/client/data/datasources/google_places_datasource.dart
import 'package:dio/dio.dart';
import '../../../core/network/api_endpoints.dart';
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
```

- [ ] **Step 2: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/data/datasources/google_places_datasource.dart`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/features/client/data/datasources/google_places_datasource.dart
git commit -m "feat: add GooglePlacesDatasource with autocomplete and details"
```

---

### Task 5: MeetingPointMapper + PlacesRepositoryImpl

**Files:**
- Create: `lib/features/client/data/mappers/meeting_point_mapper.dart`
- Create: `lib/features/client/data/repositories/places_repository_impl.dart`

- [ ] **Step 1: Create MeetingPointMapper**

```dart
// lib/features/client/data/mappers/meeting_point_mapper.dart
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
```

- [ ] **Step 2: Create PlacesRepositoryImpl**

```dart
// lib/features/client/data/repositories/places_repository_impl.dart
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
```

- [ ] **Step 3: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/data/mappers/meeting_point_mapper.dart lib/features/client/data/repositories/places_repository_impl.dart`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/features/client/data/mappers/meeting_point_mapper.dart lib/features/client/data/repositories/places_repository_impl.dart
git commit -m "feat: add MeetingPointMapper and PlacesRepositoryImpl"
```

---

### Task 6: MeetingPointSearchWidget

**Files:**
- Create: `lib/features/client/presentation/widgets/meeting_point_search_widget.dart`

- [ ] **Step 1: Create MeetingPointSearchWidget**

```dart
// lib/features/client/presentation/widgets/meeting_point_search_widget.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/extensions.dart';
import '../../../core/network/dio_client.dart';
import '../../data/datasources/google_places_datasource.dart';
import '../../data/repositories/places_repository_impl.dart';
import '../../domain/entities/meeting_point.dart';
import '../../domain/use_cases/search_meeting_points_use_case.dart';

class MeetingPointSearchWidget extends ConsumerStatefulWidget {
  final ValueChanged<MeetingPoint?> onMeetingPointSelected;

  const MeetingPointSearchWidget({
    super.key,
    required this.onMeetingPointSelected,
  });

  @override
  ConsumerState<MeetingPointSearchWidget> createState() =>
      _MeetingPointSearchWidgetState();
}

class _MeetingPointSearchWidgetState
    extends ConsumerState<MeetingPointSearchWidget> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  final _layerLink = LayerLink();
  OverlayEntry? _overlayEntry;
  Timer? _debounce;
  bool _isLoading = false;
  List<MeetingPoint> _suggestions = [];
  MeetingPoint? _selectedPoint;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_onFocusChange);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _overlayEntry?.remove();
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onFocusChange() {
    if (!_focusNode.hasFocus) {
      _removeOverlay();
    }
  }

  void _onSearchChanged(String query) {
    _debounce?.cancel();
    if (query.trim().length < 3) {
      setState(() {
        _suggestions = [];
        _isLoading = false;
      });
      _removeOverlay();
      return;
    }

    setState(() => _isLoading = true);

    _debounce = Timer(const Duration(milliseconds: 300), () async {
      try {
        final dio = createDioClient();
        final datasource = GooglePlacesDatasource(dio);
        final repository = PlacesRepositoryImpl(datasource);
        final useCase = SearchMeetingPointsUseCase(repository);

        final results = await useCase(query);
        if (mounted) {
          setState(() {
            _suggestions = results;
            _isLoading = false;
          });
          _showOverlay();
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            _suggestions = [];
            _isLoading = false;
          });
          _removeOverlay();
        }
      }
    });
  }

  void _showOverlay() {
    _removeOverlay();
    if (_suggestions.isEmpty) return;

    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        width: MediaQuery.of(context).size.width - 64,
        child: CompositedTransformFollower(
          link: _layerLink,
          showWhenUnlinked: false,
          offset: const Offset(0, 56),
          child: Material(
            elevation: 4,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              constraints: const BoxConstraints(maxHeight: 250),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Theme.of(context).colorScheme.outlineVariant,
                ),
              ),
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(vertical: 4),
                shrinkWrap: true,
                itemCount: _suggestions.length,
                separatorBuilder: (_, __) => Divider(
                  height: 1,
                  color: Theme.of(context)
                      .colorScheme
                      .outlineVariant
                      .withValues(alpha: 0.5),
                ),
                itemBuilder: (context, index) {
                  final point = _suggestions[index];
                  return ListTile(
                    dense: true,
                    leading: Icon(
                      Icons.location_on,
                      size: 20,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    title: Text(
                      point.address,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    onTap: () => _selectPoint(point),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  void _selectPoint(MeetingPoint point) {
    setState(() {
      _selectedPoint = point;
      _controller.text = point.address;
      _suggestions = [];
    });
    _removeOverlay();
    _focusNode.unfocus();
    widget.onMeetingPointSelected(point);
  }

  void clearSelection() {
    setState(() {
      _selectedPoint = null;
      _controller.clear();
      _suggestions = [];
    });
    widget.onMeetingPointSelected(null);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final radius = context.contigoRadius;
    final spacing = context.contigoSpacing;

    return CompositedTransformTarget(
      link: _layerLink,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextFormField(
            controller: _controller,
            focusNode: _focusNode,
            onChanged: _onSearchChanged,
            style: typography.bodyMedium.copyWith(color: colors.onSurface),
            cursorColor: colors.primary,
            decoration: InputDecoration(
              hintText: 'Ej. Cafeteria del Parque Central',
              hintStyle: typography.bodyMedium.copyWith(
                color: colors.onSurfaceVariant.withValues(alpha: 0.5),
              ),
              filled: true,
              fillColor: colors.surfaceContainer,
              contentPadding: EdgeInsets.symmetric(
                horizontal: spacing.md,
                vertical: spacing.md,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(radius.lg),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(radius.lg),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(radius.lg),
                borderSide: BorderSide(color: colors.primary, width: 2),
              ),
              prefixIcon: Icon(
                Icons.location_on,
                color: colors.onSurfaceVariant,
                size: 20,
              ),
              suffixIcon: _isLoading
                  ? Padding(
                      padding: EdgeInsets.all(spacing.sm),
                      child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: colors.primary,
                        ),
                      ),
                    )
                  : _selectedPoint != null
                      ? IconButton(
                          icon: Icon(
                            Icons.clear,
                            color: colors.onSurfaceVariant,
                            size: 20,
                          ),
                          onPressed: clearSelection,
                        )
                      : null,
            ),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 2: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/presentation/widgets/meeting_point_search_widget.dart`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/features/client/presentation/widgets/meeting_point_search_widget.dart
git commit -m "feat: add MeetingPointSearchWidget with autocomplete dropdown"
```

---

### Task 7: Update ServiceRequest Entity

**Files:**
- Modify: `lib/features/client/domain/entities/service_request.dart`

- [ ] **Step 1: Add MeetingPoint import and field to ServiceRequest**

Replace the content of `lib/features/client/domain/entities/service_request.dart`:

```dart
import 'request_status.dart';
import 'meeting_point.dart';

class ServiceRequest {
  final String id;
  final String serviceType;
  final String fullName;
  final String idNumber;
  final String? phone;
  final String? address;
  final MeetingPoint? meetingPoint;
  final DateTime? preferredDate;
  final String? notes;
  final List<String> documentUrls;
  final RequestStatus status;
  final DateTime createdAt;

  const ServiceRequest({
    required this.id,
    required this.serviceType,
    required this.fullName,
    required this.idNumber,
    this.phone,
    this.address,
    this.meetingPoint,
    this.preferredDate,
    this.notes,
    this.documentUrls = const [],
    this.status = RequestStatus.pending,
    required this.createdAt,
  });
}
```

- [ ] **Step 2: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/domain/entities/service_request.dart`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/features/client/domain/entities/service_request.dart
git commit -m "feat: add MeetingPoint field to ServiceRequest entity"
```

---

### Task 8: Update services_screen.dart

**Files:**
- Modify: `lib/features/client/presentation/screens/services_screen.dart`

- [ ] **Step 1: Add imports and state variable**

At the top of `services_screen.dart`, add the import:

```dart
import '../widgets/meeting_point_search_widget.dart';
import '../../domain/entities/meeting_point.dart';
```

In `_ServicesScreenState`, add state variable after `String? _location;`:

```dart
MeetingPoint? _selectedMeetingPoint;
```

- [ ] **Step 2: Replace _buildLocationSection**

Replace the entire `_buildLocationSection` method (lines 321-377) with:

```dart
  Widget _buildLocationSection(
    ContigoColors colors,
    ContigoTypography typography,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.location_on, size: 20, color: colors.primary),
            SizedBox(width: spacing.sm),
            Text(
              'Donde sera el punto de encuentro?',
              style: typography.titleSmall.copyWith(color: colors.onSurface),
            ),
          ],
        ),
        SizedBox(height: spacing.md),
        MeetingPointSearchWidget(
          onMeetingPointSelected: (point) {
            setState(() => _selectedMeetingPoint = point);
          },
        ),
      ],
    );
  }
```

- [ ] **Step 3: Update _submitRequest to use MeetingPoint**

Replace the `_submitRequest` method (lines 82-95) with:

```dart
  void _submitRequest() {
    final location = _selectedMeetingPoint?.address ?? _location ?? '';
    final category = _selectedCategory >= 0 ? _categories[_selectedCategory].title : '';
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Solicitud enviada exitosamente'
          '${category.isNotEmpty ? ' - $category' : ''}'
          '${location.isNotEmpty ? ' en $location' : ''}',
        ),
      ),
    );
    context.push(AppRoutes.requests);
  }
```

- [ ] **Step 4: Run analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze lib/features/client/presentation/screens/services_screen.dart`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add lib/features/client/presentation/screens/services_screen.dart
git commit -m "feat: replace meeting point text field with Google Places autocomplete"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run full project analysis**

Run: `cd /Users/frg/Documents/Innotechlabs/contigo/apps/mobile && dart analyze`
Expected: No errors

- [ ] **Step 2: Verify all new files exist**

Run: `ls -la lib/features/client/domain/entities/meeting_point.dart lib/features/client/domain/repositories/places_repository.dart lib/features/client/domain/use_cases/search_meeting_points_use_case.dart lib/features/client/data/models/google_place_prediction.dart lib/features/client/data/datasources/google_places_datasource.dart lib/features/client/data/mappers/meeting_point_mapper.dart lib/features/client/data/repositories/places_repository_impl.dart lib/features/client/presentation/widgets/meeting_point_search_widget.dart`
Expected: All 8 files exist

- [ ] **Step 3: Final commit if needed**

```bash
git add -A
git commit -m "feat: complete Google Places autocomplete for meeting point"
```
