import '../repositories/request_repository.dart';

class CheckIdUseCase {
  final RequestRepository _repository;
  CheckIdUseCase(this._repository);

  Future<bool> call(String idNumber) => _repository.checkId(idNumber);
}
