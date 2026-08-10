import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/clerk_auth_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final ClerkAuthDatasource _datasource;

  AuthRepositoryImpl(this._datasource);

  @override
  Future<User?> getSession() => _datasource.getSession();

  @override
  Future<void> signOut() => _datasource.clearSession();

  @override
  Future<User?> signInWithGoogle() async {
    throw UnimplementedError('Google sign-in not implemented yet');
  }

  @override
  Future<User?> signInWithEmail(String email, String password) =>
      _datasource.signInWithEmail(email, password);

  @override
  Future<User?> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required UserRole role,
  }) =>
      _datasource.signUp(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role,
      );
}
