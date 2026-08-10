import 'dart:async';

import 'package:clerk_auth/clerk_auth.dart';

import '../storage/secure_storage_service.dart';
import 'clerk_persistor.dart';

/// Error de autenticación con Clerk con mensaje listo para mostrar al usuario.
class ClerkAuthException implements Exception {
  const ClerkAuthException(this.message);

  final String message;

  @override
  String toString() => message;
}

/// Wrapper de la SDK `clerk_auth` para el flujo de autenticación real.
///
/// La publishable key se inyecta en compilación con
/// `--dart-define=CLERK_PUBLISHABLE_KEY=...`. El rol del usuario NUNCA se lee
/// de Clerk: lo asigna el backend en `POST /users/me`.
class ClerkAuthService {
  ClerkAuthService(this._storage);

  final SecureStorageService _storage;

  static const String publishableKey =
      String.fromEnvironment('CLERK_PUBLISHABLE_KEY');

  Auth? _auth;

  bool get isInitialized => _auth != null;

  /// Stream de tokens de sesión renovados (JWT para el header del backend).
  Stream<SessionToken>? get sessionTokenStream => _auth?.sessionTokenStream;

  /// Usuario autenticado en Clerk, o `null` si no hay sesión.
  User? get user => _auth?.user;

  Future<Auth> ensureInitialized() async {
    final existing = _auth;
    if (existing != null) return existing;

    if (publishableKey.isEmpty) {
      throw const ClerkAuthException(
        'Falta CLERK_PUBLISHABLE_KEY. Ejecuta con '
        '--dart-define=CLERK_PUBLISHABLE_KEY=pk_test_...',
      );
    }

    final auth = Auth(
      config: AuthConfig(
        publishableKey: publishableKey,
        persistor: SecureClerkPersistor(_storage),
      ),
    );
    await auth.initialize();
    _auth = auth;
    return auth;
  }

  /// Devuelve el JWT de la sesión activa, o `null` si no hay sesión.
  Future<String?> sessionToken() async {
    final auth = await ensureInitialized();
    if (!auth.isSignedIn) return null;
    final token = await auth.sessionToken();
    return token.jwt;
  }

  Future<void> signInWithEmail({
    required String email,
    required String password,
  }) async {
    final auth = await ensureInitialized();
    await auth.attemptSignIn(
      strategy: Strategy.password,
      identifier: email.trim(),
      password: password,
    );
    if (!auth.isSignedIn) {
      throw const ClerkAuthException(
        'No se pudo iniciar sesión con esos datos.',
      );
    }
  }

  Future<void> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    final auth = await ensureInitialized();
    await auth.attemptSignUp(
      strategy: Strategy.password,
      firstName: firstName,
      lastName: lastName,
      emailAddress: email.trim(),
      password: password,
      passwordConfirmation: password,
    );
    if (!auth.isSignedIn) {
      throw const ClerkAuthException(
        'Verifica tu correo electrónico para completar el registro.',
      );
    }
  }

  Future<void> signOut() async {
    final auth = _auth;
    if (auth != null) {
      await auth.signOut();
    }
  }

  void dispose() {
    _auth?.terminate();
    _auth = null;
  }
}
