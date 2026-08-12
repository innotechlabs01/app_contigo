import 'dart:async';
import 'dart:convert';

import 'package:clerk_auth/clerk_auth.dart';

import '../storage/secure_storage_service.dart';

/// [Persistor] de clerk_auth respaldado por el almacenamiento seguro de la
/// plataforma (Keychain en iOS, EncryptedSharedPreferences en Android).
///
/// clerk_auth guarda el cliente y el entorno como JSON; aquí se serializa a
/// string y se persiste en el secure store para no dejar datos de sesión en
/// archivos del sistema.
class SecureClerkPersistor implements Persistor {
  const SecureClerkPersistor(this._storage);

  final SecureStorageService _storage;

  static const _prefix = 'clerk_sdk_';

  @override
  Future<void> initialize() async {}

  @override
  void terminate() {}

  @override
  FutureOr<T?> read<T>(String key) async {
    final raw = await _storage.read('$_prefix$key');
    if (raw == null) return null;
    if (T == String) return raw as T;
    try {
      return jsonDecode(raw) as T;
    } catch (_) {
      return null;
    }
  }

  @override
  FutureOr<void> write<T>(String key, T value) {
    final encoded = value is String ? value : jsonEncode(value);
    return _storage.write('$_prefix$key', encoded);
  }

  @override
  FutureOr<void> delete(String key) => _storage.delete('$_prefix$key');
}
