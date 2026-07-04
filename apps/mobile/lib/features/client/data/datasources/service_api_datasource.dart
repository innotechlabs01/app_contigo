import '../../domain/entities/service_type.dart';

class ServiceApiDatasource {
  Future<List<ServiceType>> getServices() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return ServiceType.mockServices;
  }
}
