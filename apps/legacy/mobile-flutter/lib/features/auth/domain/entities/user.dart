enum UserRole { client, companion, admin }

class User {
  final String id;
  final String email;
  final String name;
  final String? photoUrl;
  final UserRole role;
  final DateTime? createdAt;

  const User({
    required this.id,
    required this.email,
    required this.name,
    this.photoUrl,
    required this.role,
    this.createdAt,
  });

  bool get isClient => role == UserRole.client;
  bool get isCompanion => role == UserRole.companion;
  bool get isAdmin => role == UserRole.admin;
}
