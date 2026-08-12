class Companion {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? avatar;
  final double rating;
  final int experienceYears;
  final List<String> languages;
  final List<String> services;
  final String? bio;

  const Companion({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.avatar,
    this.rating = 5.0,
    this.experienceYears = 0,
    this.languages = const [],
    this.services = const [],
    this.bio,
  });

  String get fullName => '$firstName $lastName';

  String get experienceLabel {
    if (experienceYears <= 0) return 'Nuevo';
    if (experienceYears == 1) return '1 año de experiencia';
    return '$experienceYears años de experiencia';
  }

  bool supportsService(String serviceType) => services.isEmpty || services.contains(serviceType);

  bool matchesQuery(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return true;
    return fullName.toLowerCase().contains(q) ||
        languages.any((l) => l.toLowerCase().contains(q)) ||
        services.any((s) => s.toLowerCase().contains(q));
  }
}
