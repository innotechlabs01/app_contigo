import '../../domain/entities/service_request.dart';
import '../../domain/repositories/request_repository.dart';
import '../datasources/request_api_datasource.dart';

class RequestRepositoryImpl implements RequestRepository {
  final RequestApiDatasource _datasource;

  RequestRepositoryImpl(this._datasource);

  @override
  Future<ServiceRequest> createRequest({
    required String serviceType,
    required String fullName,
    required String phone,
    String? companionId,
    String? address,
    String? meetingPoint,
    String? preferredDate,
    String? notes,
  }) async {
    return await _datasource.createRequest(
      serviceType: serviceType,
      fullName: fullName,
      phone: phone,
      companionId: companionId,
      address: address,
      meetingPoint: meetingPoint,
      preferredDate: preferredDate,
      notes: notes,
    );
  }

  @override
  Future<List<ServiceRequest>> getMyRequests() async {
    return await _datasource.getMyRequests();
  }

  @override
  Future<List<ServiceRequest>> getPendingRequests() async {
    return await _datasource.getPendingRequests();
  }

  @override
  Future<List<ServiceRequest>> getCompanionRequests() async {
    return await _datasource.getCompanionRequests();
  }

  @override
  Future<ServiceRequest> acceptRequest(String requestId) async {
    return await _datasource.acceptRequest(requestId);
  }

  @override
  Future<ServiceRequest> rejectRequest(String requestId) async {
    return await _datasource.rejectRequest(requestId);
  }
}
