import 'package:flutter/material.dart';
import '../../features/client/domain/entities/request_status.dart';

class ContigoStatusPill extends StatelessWidget {
  final RequestStatus status;

  const ContigoStatusPill({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(56),
      ),
      child: Text(
        _label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: _textColor,
        ),
      ),
    );
  }

  String get _label => switch (status) {
    RequestStatus.pending => 'Pending',
    RequestStatus.accepted => 'Accepted',
    RequestStatus.rejected => 'Rejected',
    RequestStatus.approved => 'Approved',
    RequestStatus.inReview => 'In Review',
    RequestStatus.cancelled => 'Cancelled',
    RequestStatus.completed => 'Completed',
    RequestStatus.expired => 'Expired',
  };

  Color get _backgroundColor => switch (status) {
    RequestStatus.pending => const Color(0xFFFFF59D),
    RequestStatus.accepted => const Color(0xFFA5D6A7),
    RequestStatus.rejected => const Color(0xFFEF9A9A),
    RequestStatus.approved => const Color(0xFFA5D6A7),
    RequestStatus.inReview => const Color(0xFF90CAF9),
    RequestStatus.cancelled => const Color(0xFFE0E0E0),
    RequestStatus.completed => const Color(0xFFA5D6A7),
    RequestStatus.expired => const Color(0xFFE0E0E0),
  };

  Color get _textColor => switch (status) {
    RequestStatus.pending => const Color(0xFFF57F17),
    RequestStatus.accepted => const Color(0xFF1B5E20),
    RequestStatus.rejected => Colors.white,
    RequestStatus.approved => const Color(0xFF1B5E20),
    RequestStatus.inReview => Colors.white,
    RequestStatus.cancelled => const Color(0xFF616161),
    RequestStatus.completed => const Color(0xFF1B5E20),
    RequestStatus.expired => const Color(0xFF616161),
  };
}
