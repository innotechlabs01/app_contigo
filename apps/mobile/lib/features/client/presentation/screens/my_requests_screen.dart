import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';
import '../../../../core/ws/ws_event.dart';
import '../../../../core/ws/ws_provider.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';
import '../../../../shared/widgets/contigo_status_pill.dart';
import '../../domain/entities/request_status.dart';
import '../../domain/entities/service_request.dart';
import '../view_models/client_requests_view_model.dart';

class MyRequestsScreen extends ConsumerWidget {
  const MyRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final requestsAsync = ref.watch(clientRequestsListProvider);

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        backgroundColor: colors.surface,
        title: const Text('Mis Solicitudes'),
      ),
      body: requestsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ContigoEmptyState(
          icon: Icons.error_outline,
          title: 'Error al cargar',
          subtitle: e.toString(),
        ),
        data: (requests) => requests.isEmpty
            ? ContigoEmptyState(
                icon: Icons.assignment_outlined,
                title: 'No tienes solicitudes aún',
                subtitle: 'Tus solicitudes de servicio aparecerán aquí.',
                actionLabel: 'Solicitar un servicio',
                onAction: () => context.go(AppRoutes.services),
              )
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: requests.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) =>
                    _RequestCard(request: requests[index]),
              ),
      ),
    );
  }
}

class _RequestCard extends StatelessWidget {
  final ServiceRequest request;

  const _RequestCard({required this.request});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return ContigoCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.assignment, color: colors.primary, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  request.serviceType,
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
            request.fullName,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
          ),
          const SizedBox(height: 12),
          Divider(color: colors.outlineVariant, height: 1, thickness: 0.5),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.calendar_today, size: 14, color: colors.onSurfaceVariant),
              const SizedBox(width: 8),
              Text(
                request.preferredDate ?? '',
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
