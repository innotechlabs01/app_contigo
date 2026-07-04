import 'package:flutter/material.dart';

import '../../../../shared/widgets/contigo_empty_state.dart';
import '../widgets/stats_card.dart';
import '../../domain/entities/companion_stats.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    const stats = CompanionStats(
      totalSessions: 24,
      completedSessions: 18,
      totalEarnings: 1250.00,
      pendingRequests: 3,
      acceptedRequests: 2,
    );

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Resumen', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: CompanionStatsCard(
                  label: 'Sesiones',
                  value: '${stats.completedSessions}/${stats.totalSessions}',
                  icon: Icons.event_available,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CompanionStatsCard(
                  label: 'Ganancias',
                  value: '\$${stats.totalEarnings}',
                  icon: Icons.account_balance_wallet,
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: CompanionStatsCard(
                  label: 'Pendientes',
                  value: '${stats.pendingRequests}',
                  icon: Icons.pending_actions,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CompanionStatsCard(
                  label: 'Aceptadas',
                  value: '${stats.acceptedRequests}',
                  icon: Icons.check_circle_outline,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          Text('Próximas sesiones',
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          const ContigoEmptyState(
            icon: Icons.calendar_today,
            title: 'No hay sesiones próximas',
            subtitle: 'Tus próximas sesiones aparecerán aquí',
          ),
        ],
      ),
    );
  }
}
