import '../entities/companion.dart';

abstract class CompanionRepository {
  Future<List<Companion>> getCompanions();
}
