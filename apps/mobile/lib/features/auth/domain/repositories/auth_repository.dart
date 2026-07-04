import '../entities/user.dart';

abstract class AuthRepository {
  Future<User?> getSession();
  Future<void> signOut();
  Future<User?> signInWithGoogle();
  Future<User?> signInWithEmail(String email, String password);
}
