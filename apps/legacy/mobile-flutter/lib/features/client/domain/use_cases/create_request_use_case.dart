import '../entities/service_request.dart';
import '../repositories/request_repository.dart';

class CreateRequestUseCase {
  final RequestRepository _repository;
  CreateRequestUseCase(this._repository);

  Future<ServiceRequest> call({
    required String serviceType,
    required String fullName,
    required String phone,
    String? address,
    String? meetingPoint,
    String? preferredDate,
    String? notes,
  }) =>
      _repository.createRequest(
        serviceType: serviceType,
        fullName: fullName,
        phone: phone,
        address: address,
        meetingPoint: meetingPoint,
        preferredDate: preferredDate,
        notes: notes,
      );
}
