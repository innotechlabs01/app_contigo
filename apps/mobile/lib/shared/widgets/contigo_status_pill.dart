import 'package:flutter/material.dart';

enum RequestStatus { pending, approved, rejected, inReview }

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
    RequestStatus.approved => 'Approved',
    RequestStatus.rejected => 'Rejected',
    RequestStatus.inReview => 'In Review',
  };

  Color get _backgroundColor => switch (status) {
    RequestStatus.pending => const Color(0xFFFFF59D),
    RequestStatus.approved => const Color(0xFFA5D6A7),
    RequestStatus.rejected => const Color(0xFFEF9A9A),
    RequestStatus.inReview => const Color(0xFF90CAF9),
  };

  Color get _textColor => switch (status) {
    RequestStatus.pending => const Color(0xFFF57F17),
    RequestStatus.approved => const Color(0xFF1B5E20),
    RequestStatus.rejected => Colors.white,
    RequestStatus.inReview => Colors.white,
  };
}
