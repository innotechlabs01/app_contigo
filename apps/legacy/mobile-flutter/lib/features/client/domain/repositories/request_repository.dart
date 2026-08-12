import '../entities/service_request.dart';

abstract class RequestRepository {
  Future<ServiceRequest> createRequest({
    required String serviceType,
    required String fullName,
    required String phone,
    String? companionId,
    String? address,
    String? meetingPoint,
    String? preferredDate,
    String? notes,
  });
  Future<List<ServiceRequest>> getMyRequests();
  Future<List<ServiceRequest>> getPendingRequests();
  Future<List<ServiceRequest>> getCompanionRequests();
  Future<ServiceRequest> acceptRequest(String requestId);
  Future<ServiceRequest> rejectRequest(String requestId);
}
