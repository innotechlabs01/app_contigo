import '../../domain/entities/service_type.dart';
import '../../domain/repositories/service_repository.dart';
import '../datasources/service_api_datasource.dart';

class ServiceRepositoryImpl implements ServiceRepository {
  final ServiceApiDatasource _datasource;

  ServiceRepositoryImpl(this._datasource);

  @override
  Future<List<ServiceType>> getServices() => _datasource.getServices();
}
