import 'package:flutter/material.dart';

abstract class AppGradients {
  static LinearGradient get primary => const LinearGradient(
    colors: [Color(0xFF00668A), Color(0xFF85CDF7)],
    begin: Alignment(-1.0, -1.0),
    end: Alignment(1.0, 1.0),
  );

  static LinearGradient get primaryDark => const LinearGradient(
    colors: [Color(0xFFB4E8FF), Color(0xFF87CEEB)],
    begin: Alignment(-1.0, -1.0),
    end: Alignment(1.0, 1.0),
  );
}
