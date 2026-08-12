import '../../domain/entities/companion.dart';
import '../../domain/repositories/companion_repository.dart';
import '../datasources/companion_api_datasource.dart';

class CompanionRepositoryImpl implements CompanionRepository {
  final CompanionApiDatasource _datasource;

  CompanionRepositoryImpl(this._datasource);

  @override
  Future<List<Companion>> getCompanions() async {
    return await _datasource.getCompanions();
  }
}
