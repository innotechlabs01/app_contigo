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
