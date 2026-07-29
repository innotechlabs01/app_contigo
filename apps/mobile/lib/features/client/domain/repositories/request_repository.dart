import '../entities/service_request.dart';

abstract class RequestRepository {
  Future<ServiceRequest> createRequest(ServiceRequest request);
  Future<List<ServiceRequest>> getMyRequests();
  Future<List<ServiceRequest>> getCompanionRequests();
  Future<ServiceRequest> acceptRequest(String requestId);
  Future<ServiceRequest> rejectRequest(String requestId);
  Future<bool> checkId(String idNumber);
}
