import '../entities/service_request.dart';
import '../repositories/request_repository.dart';

class CreateRequestUseCase {
  final RequestRepository _repository;
  CreateRequestUseCase(this._repository);

  Future<ServiceRequest> call(ServiceRequest request) =>
      _repository.createRequest(request);
}
