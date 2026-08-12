class CompanionSession {
  final String id;
  final String clientName;
  final String serviceType;
  final DateTime date;
  final String status;
  final String? notes;

  const CompanionSession({
    required this.id,
    required this.clientName,
    required this.serviceType,
    required this.date,
    required this.status,
    this.notes,
  });
}
