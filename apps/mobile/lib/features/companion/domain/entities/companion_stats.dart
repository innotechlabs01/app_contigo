class CompanionStats {
  final int totalSessions;
  final int completedSessions;
  final double totalEarnings;
  final int pendingRequests;
  final int acceptedRequests;

  const CompanionStats({
    this.totalSessions = 0,
    this.completedSessions = 0,
    this.totalEarnings = 0,
    this.pendingRequests = 0,
    this.acceptedRequests = 0,
  });
}
