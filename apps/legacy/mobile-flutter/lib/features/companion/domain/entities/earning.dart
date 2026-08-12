class CompanionEarning {
  final String id;
  final double amount;
  final String description;
  final DateTime date;
  final String status;

  const CompanionEarning({
    required this.id,
    required this.amount,
    required this.description,
    required this.date,
    this.status = 'pending',
  });
}
