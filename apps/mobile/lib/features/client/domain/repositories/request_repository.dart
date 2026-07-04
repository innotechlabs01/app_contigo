import '../entities/service_request.dart';

abstract class RequestRepository {
  Future<ServiceRequest> createRequest(ServiceRequest request);
  Future<List<ServiceRequest>> getMyRequests();
  Future<bool> checkId(String idNumber);
}
