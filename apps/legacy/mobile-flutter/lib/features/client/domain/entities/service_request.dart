import 'request_status.dart';

class ServiceRequest {
  final String id;
  final String clientId;
  final String? companionId;
  final String serviceType;
  final String fullName;
  final String phone;
  final String? address;
  final String? meetingPoint;
  final String preferredDate;
  final String? notes;
  final RequestStatus status;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const ServiceRequest({
    required this.id,
    required this.clientId,
    this.companionId,
    required this.serviceType,
    required this.fullName,
    required this.phone,
    this.address,
    this.meetingPoint,
    this.preferredDate = '',
    this.notes,
    this.status = RequestStatus.pending,
    required this.createdAt,
    this.updatedAt,
  });
}
