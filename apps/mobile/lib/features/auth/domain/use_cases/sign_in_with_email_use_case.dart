import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SignInWithEmailUseCase {
  const SignInWithEmailUseCase(this._repository);

  final AuthRepository _repository;

  Future<User?> call(String email, String password) =>
      _repository.signInWithEmail(email, password);
}
