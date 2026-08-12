import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../domain/entities/companion.dart';
import '../../domain/use_cases/get_companions_use_case.dart';

part 'companions_provider.g.dart';

@Riverpod(keepAlive: true)
Future<List<Companion>> companions(Ref ref) async {
  final repo = ref.watch(companionRepositoryProvider);
  return GetCompanionsUseCase(repo)();
}
