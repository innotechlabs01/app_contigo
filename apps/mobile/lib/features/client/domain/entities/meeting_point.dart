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
