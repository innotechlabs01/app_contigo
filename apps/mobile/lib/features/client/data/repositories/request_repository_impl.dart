import '../../domain/entities/service_request.dart';
import '../../domain/repositories/request_repository.dart';
import '../datasources/request_api_datasource.dart';

class RequestRepositoryImpl implements RequestRepository {
  final RequestApiDatasource _datasource;

  RequestRepositoryImpl(this._datasource);

  @override
  Future<ServiceRequest> createRequest(ServiceRequest request) =>
      _datasource.createRequest(request);

  @override
  Future<List<ServiceRequest>> getMyRequests() =>
      _datasource.getMyRequests();

  @override
  Future<bool> checkId(String idNumber) =>
      _datasource.checkId(idNumber);
}
