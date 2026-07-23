import '../../../../core/storage/secure_storage_service.dart';
import '../../domain/entities/user.dart';

class ClerkAuthDatasource {
  final SecureStorageService _storage;

  ClerkAuthDatasource(this._storage);

  static const _tokenKey = 'clerk_session_token';
  static const _userIdKey = 'clerk_user_id';
  static const _userEmailKey = 'clerk_user_email';
  static const _userNameKey = 'clerk_user_name';
  static const _userRoleKey = 'clerk_user_role';

  Future<void> saveSession({
    required String token,
    required String userId,
    required String email,
    required String name,
    required UserRole role,
  }) async {
    await _storage.write(_tokenKey, token);
    await _storage.write(_userIdKey, userId);
    await _storage.write(_userEmailKey, email);
    await _storage.write(_userNameKey, name);
    await _storage.write(_userRoleKey, role.name);
  }

  Future<User?> getSession() async {
    final token = await _storage.read(_tokenKey);
    if (token == null) return null;

    final userId = await _storage.read(_userIdKey);
    final email = await _storage.read(_userEmailKey);
    final name = await _storage.read(_userNameKey);
    final roleStr = await _storage.read(_userRoleKey);

    if (userId == null || email == null || name == null || roleStr == null) {
      return null;
    }

    return User(
      id: userId,
      email: email,
      name: name,
      role: UserRole.values.firstWhere((r) => r.name == roleStr),
    );
  }

  Future<void> clearSession() async {
    await _storage.delete(_tokenKey);
    await _storage.delete(_userIdKey);
    await _storage.delete(_userEmailKey);
    await _storage.delete(_userNameKey);
    await _storage.delete(_userRoleKey);
  }

  Future<User> signInWithEmail(String email, String password) async {
    final normalizedEmail = email.trim().toLowerCase();
    final inferredRole = normalizedEmail.contains('companion')
        ? UserRole.companion
        : UserRole.client;
    final user = User(
      id: 'demo-${normalizedEmail.hashCode.abs()}',
      email: normalizedEmail,
      name: normalizedEmail.split('@').first.replaceAll('.', ' '),
      role: inferredRole,
    );

    await saveSession(
      token: 'demo_session_${DateTime.now().millisecondsSinceEpoch}',
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    );

    return user;
  }
}
