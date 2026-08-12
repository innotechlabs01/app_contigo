import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SignUpWithEmailUseCase {
  const SignUpWithEmailUseCase(this._repository);

  final AuthRepository _repository;

  Future<User?> call({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required UserRole role,
  }) =>
      _repository.signUp(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role,
      );
}
