import '../entities/service_type.dart';

abstract class ServiceRepository {
  Future<List<ServiceType>> getServices();
}
