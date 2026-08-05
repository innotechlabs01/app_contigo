import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../domain/entities/service_request.dart';

part 'my_requests_view_model.g.dart';

@riverpod
Future<List<ServiceRequest>> myRequestsList(Ref ref) async {
  final repo = ref.watch(requestRepositoryProvider);
  return repo.getMyRequests();
}

@riverpod
class MyRequestsFilter extends _$MyRequestsFilter {
  @override
  String? build() => null;

  void apply(String? filter) => state = filter;
  void clear() => state = null;
}
