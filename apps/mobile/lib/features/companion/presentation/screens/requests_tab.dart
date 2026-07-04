import 'package:flutter/material.dart';

class CompanionRequestsTab extends StatelessWidget {
  const CompanionRequestsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Requests')),
      body: const Center(child: Text('Requests')),
    );
  }
}
