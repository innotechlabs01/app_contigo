import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';
import '../../../../shared/widgets/contigo_status_pill.dart';
import '../../domain/entities/request_status.dart';

class _MockRequest {
  final String title;
  final String description;
  final RequestStatus status;
  final String date;
  final IconData icon;

  const _MockRequest({
    required this.title,
    required this.description,
    required this.status,
    required this.date,
    required this.icon,
  });
}

const _mockRequests = [
  _MockRequest(
    title: 'Cita Médica',
    description: 'Dr. Ramírez - Cardiología',
    status: RequestStatus.pending,
    date: '12 Ene 2025',
    icon: Icons.medical_services,
  ),
  _MockRequest(
    title: 'Recados Personales',
    description: 'Supermercado La Colmena',
    status: RequestStatus.approved,
    date: '10 Ene 2025',
    icon: Icons.shopping_bag,
  ),
  _MockRequest(
    title: 'Medicamentos',
    description: 'Farmacia San José',
    status: RequestStatus.inReview,
    date: '8 Ene 2025',
    icon: Icons.medication,
  ),
];

class MyRequestsScreen extends ConsumerWidget {
  const MyRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final radius = context.contigoRadius;
    final requests = _mockRequests;

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        backgroundColor: colors.surface,
        title: const Text('Mis Solicitudes'),
      ),
      body: requests.isEmpty
          ? _buildEmptyState(context, colors)
          : _buildRequestsList(context, colors, radius, requests),
    );
  }

  Widget _buildEmptyState(BuildContext context, ContigoColors colors) {
    return ContigoEmptyState(
      icon: Icons.assignment_outlined,
      title: 'No tienes solicitudes aún',
      subtitle: 'Tus solicitudes de servicio aparecerán aquí.',
      actionLabel: 'Solicitar un servicio',
      onAction: () => context.go(AppRoutes.services),
    );
  }

  Widget _buildRequestsList(
    BuildContext context,
    ContigoColors colors,
    ContigoRadius radius,
    List<_MockRequest> requests,
  ) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: requests.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) =>
          _buildRequestCard(context, colors, radius, requests[index]),
    );
  }

  Widget _buildRequestCard(
    BuildContext context,
    ContigoColors colors,
    ContigoRadius radius,
    _MockRequest request,
  ) {
    return ContigoCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(request.icon, color: colors.primary, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  request.title,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: colors.onSurface,
                      ),
                ),
              ),
              ContigoStatusPill(status: request.status),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            request.description,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
          ),
          const SizedBox(height: 12),
          Divider(color: colors.outlineVariant, height: 1, thickness: 0.5),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(
                Icons.calendar_today,
                size: 14,
                color: colors.onSurfaceVariant,
              ),
              const SizedBox(width: 8),
              Text(
                request.date,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: colors.onSurfaceVariant,
                    ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
