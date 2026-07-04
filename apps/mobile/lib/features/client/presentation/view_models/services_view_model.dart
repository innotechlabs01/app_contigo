import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../domain/entities/service_type.dart';
import '../../domain/repositories/service_repository.dart';
import '../../data/repositories/service_repository_impl.dart';
import '../../data/datasources/service_api_datasource.dart';

part 'services_view_model.g.dart';

@riverpod
ServiceRepository serviceRepository(Ref ref) {
  return ServiceRepositoryImpl(ServiceApiDatasource());
}

@riverpod
Future<List<ServiceType>> servicesList(Ref ref) async {
  final repo = ref.watch(serviceRepositoryProvider);
  return repo.getServices();
}
