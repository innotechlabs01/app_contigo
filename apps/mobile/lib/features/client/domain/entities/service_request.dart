import 'request_status.dart';

class ServiceRequest {
  final String id;
  final String serviceType;
  final String fullName;
  final String idNumber;
  final String? phone;
  final String? address;
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
    this.preferredDate,
    this.notes,
    this.documentUrls = const [],
    this.status = RequestStatus.pending,
    required this.createdAt,
  });
}
