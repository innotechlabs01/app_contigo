import 'dart:async';

import 'package:clerk_auth/clerk_auth.dart' as clerk;
import 'package:dio/dio.dart';

import '../../../../core/auth/clerk_auth_service.dart';
import '../../../../core/network/api_endpoints.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../domain/entities/user.dart';

/// Fuente de datos de autenticación con Clerk real.
///
/// - Las credenciales se validan contra Clerk (`attemptSignIn`/`attemptSignUp`).
/// - El JWT de sesión se envía al backend en el header `Authorization`.
/// - El rol lo asigna el backend en `POST /users/me`; nunca se lee de Clerk.
class ClerkAuthDatasource {
  ClerkAuthDatasource({
    required SecureStorageService storage,
    required Dio dio,
    required ClerkAuthService authService,
  })  : _storage = storage,
        _dio = dio,
        _authService = authService;

  final SecureStorageService _storage;
  final Dio _dio;
  final ClerkAuthService _authService;

  static const _tokenKey = 'clerk_session_token';
  static const _userIdKey = 'clerk_user_id';
  static const _userEmailKey = 'clerk_user_email';
  static const _userNameKey = 'clerk_user_name';
  static const _userRoleKey = 'clerk_user_role';

  StreamSubscription<clerk.SessionToken>? _tokenSub;

  Future<void> _ensureClerk() async {
    if (_tokenSub != null) return;
    final auth = await _authService.ensureInitialized();
    _tokenSub = auth.sessionTokenStream.listen((token) {
      final jwt = token.jwt;
      setAuthToken(jwt);
      unawaited(_storage.write(_tokenKey, jwt));
    });
  }

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

    setAuthToken(token);
    unawaited(_refreshTokenBestEffort());

    return User(
      id: userId,
      email: email,
      name: name,
      role: UserRole.values.firstWhere((r) => r.name == roleStr),
    );
  }

  Future<void> clearSession() async {
    await _authService.signOut();
    await _storage.delete(_tokenKey);
    await _storage.delete(_userIdKey);
    await _storage.delete(_userEmailKey);
    await _storage.delete(_userNameKey);
    await _storage.delete(_userRoleKey);
    setAuthToken(null);
  }

  Future<User> signInWithEmail(String email, String password) async {
    await _ensureClerk();
    await _authService.signInWithEmail(email: email, password: password);
    return _finalizeSession();
  }

  Future<User> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required UserRole role,
  }) async {
    await _ensureClerk();
    await _authService.signUp(
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    );
    return _finalizeSession(role: role);
  }

  Future<User> _finalizeSession({UserRole? role}) async {
    final jwt = await _authService.sessionToken();
    if (jwt == null) {
      throw const ClerkAuthException('No se obtuvo un token de sesión.');
    }
    setAuthToken(jwt);

    final user = await _syncUserWithBackend(role: role);
    await saveSession(
      token: jwt,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    );
    return user;
  }

  Future<User> _syncUserWithBackend({UserRole? role}) async {
    final clerkUser = _authService.user;
    if (clerkUser == null) {
      throw const ClerkAuthException('Sesión inválida.');
    }

    final response = await _dio.post(
      ApiEndpoints.usersMe,
      data: {
        'email': clerkUser.email,
        'first_name': clerkUser.firstName ?? '',
        'last_name': clerkUser.lastName ?? '',
        'role': role?.name,
      },
    );
    final data = response.data['data'] as Map<String, dynamic>;
    return _userFromJson(data);
  }

  Future<void> _refreshTokenBestEffort() async {
    try {
      await _ensureClerk();
      final jwt = await _authService.sessionToken();
      if (jwt != null) {
        setAuthToken(jwt);
        await _storage.write(_tokenKey, jwt);
      }
    } catch (_) {
      // Sin conectividad o sesión vencida: se conserva el token persistido.
    }
  }

  User _userFromJson(Map<String, dynamic> json) {
    final firstName = json['first_name'] as String? ?? '';
    final lastName = json['last_name'] as String? ?? '';
    final roleStr = json['role'] as String? ?? 'client';
    return User(
      id: json['id'] as String,
      email: json['email'] as String? ?? '',
      name: [firstName, lastName].where((s) => s.isNotEmpty).join(' '),
      role: UserRole.values.firstWhere(
        (r) => r.name == roleStr,
        orElse: () => UserRole.client,
      ),
    );
  }
}
