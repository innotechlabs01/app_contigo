import 'package:flutter/material.dart';

class EarningsTab extends StatelessWidget {
  const EarningsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Earnings')),
      body: const Center(child: Text('Earnings')),
    );
  }
}
