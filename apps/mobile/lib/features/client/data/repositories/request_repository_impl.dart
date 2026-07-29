import '../../domain/entities/service_request.dart';
import '../../domain/repositories/request_repository.dart';
import '../datasources/request_api_datasource.dart';

class RequestRepositoryImpl implements RequestRepository {
  final RequestApiDatasource _datasource;

  RequestRepositoryImpl(this._datasource);

  @override
  Future<ServiceRequest> createRequest(ServiceRequest request) async {
    return await _datasource.createRequest(request);
  }

  @override
  Future<List<ServiceRequest>> getMyRequests() async {
    return await _datasource.getMyRequests();
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

  @override
  Future<bool> checkId(String idNumber) async {
    return await _datasource.checkId(idNumber);
  }
}
