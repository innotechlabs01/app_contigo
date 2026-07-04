import 'package:flutter/material.dart';

class CalendarTab extends StatelessWidget {
  const CalendarTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Calendario')),
      body: Center(
        child: Text(
          'Calendario de sesiones',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      ),
    );
  }
}
