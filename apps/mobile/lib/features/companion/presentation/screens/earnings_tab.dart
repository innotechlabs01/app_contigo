import 'package:flutter/material.dart';

import '../../../../shared/widgets/contigo_empty_state.dart';

class EarningsTab extends StatelessWidget {
  const EarningsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ganancias')),
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF00668A), Color(0xFF85CDF7)],
                begin: Alignment(-1.0, -1.0),
                end: Alignment(1.0, 1.0),
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              children: [
                Text('Balance Total',
                    style: TextStyle(color: Colors.white70, fontSize: 14)),
                SizedBox(height: 8),
                Text('\$1,250.00',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.bold)),
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _BalanceItem(label: 'Pagado', value: '\$850.00'),
                    _BalanceItem(label: 'Pendiente', value: '\$400.00'),
                  ],
                ),
              ],
            ),
          ),
          const Expanded(
            child: ContigoEmptyState(
              icon: Icons.receipt_long,
              title: 'Historial de pagos',
              subtitle: 'El historial de tus ganancias aparecerá aquí',
            ),
          ),
        ],
      ),
    );
  }
}

class _BalanceItem extends StatelessWidget {
  final String label;
  final String value;
  const _BalanceItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label,
            style: const TextStyle(color: Colors.white70, fontSize: 12)),
        const SizedBox(height: 4),
        Text(value,
            style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600)),
      ],
    );
  }
}
