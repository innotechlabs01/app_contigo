import '../entities/companion.dart';
import '../repositories/companion_repository.dart';

class GetCompanionsUseCase {
  const GetCompanionsUseCase(this._repository);

  final CompanionRepository _repository;

  Future<List<Companion>> call() => _repository.getCompanions();
}
