import '../repositories/auth_repository.dart';
import '../entities/user.dart';

class GetSessionUseCase {
  final AuthRepository _repository;

  GetSessionUseCase(this._repository);

  Future<User?> call() => _repository.getSession();
}
