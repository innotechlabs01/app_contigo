import '../entities/user.dart';

abstract class AuthRepository {
  Future<User?> getSession();
  Future<void> signOut();
  Future<User?> signInWithGoogle();
  Future<User?> signInWithEmail(String email, String password);
  Future<User?> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required UserRole role,
  });
}
