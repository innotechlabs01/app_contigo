import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ContigoShimmer extends StatelessWidget {
  final Widget child;

  const ContigoShimmer({
    super.key,
    required this.child,
  });

  static Widget card({double height = 120}) {
    return ContigoShimmer(
      child: Container(
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  static Widget circle({double size = 48}) {
    return ContigoShimmer(
      child: Container(
        width: size,
        height: size,
        decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: child,
    );
  }
}
