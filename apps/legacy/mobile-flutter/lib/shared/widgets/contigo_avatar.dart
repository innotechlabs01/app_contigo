import 'package:flutter/material.dart';

class ContigoAvatar extends StatelessWidget {
  final String? imageUrl;
  final String? name;
  final double size;
  final bool isOnline;

  const ContigoAvatar({
    super.key,
    this.imageUrl,
    this.name,
    this.size = 48,
    this.isOnline = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          CircleAvatar(
            radius: size / 2,
            backgroundImage: imageUrl != null ? NetworkImage(imageUrl!) : null,
            child: imageUrl == null && name != null ? Text(_initials) : null,
          ),
          if (imageUrl == null && name == null)
            CircleAvatar(
              radius: size / 2,
              child: const Icon(Icons.person),
            ),
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: isOnline ? const Color(0xFF4CAF50) : const Color(0xFFF44336),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String get _initials {
    if (name == null || name!.isEmpty) return '';
    final parts = name!.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return parts.first[0].toUpperCase();
  }
}
