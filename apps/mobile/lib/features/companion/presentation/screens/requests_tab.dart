import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';
import '../../../../shared/widgets/contigo_status_pill.dart';
import '../../../client/data/datasources/request_api_datasource.dart';
import '../../../client/data/repositories/request_repository_impl.dart';
import '../../../client/domain/entities/request_status.dart';
import '../../../client/domain/entities/service_request.dart';
import '../../view_models/companion_requests_view_model.dart';
import '../widgets/incoming_request_card.dart';

class CompanionRequestsTab extends ConsumerWidget {
  const CompanionRequestsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final requestsAsync = ref.watch(companionRequestsListProvider);

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(title: const Text('Solicitudes')),
      body: requestsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ContigoEmptyState(
          icon: Icons.error_outline,
          title: 'Error al cargar',
          subtitle: e.toString(),
        ),
        data: (requests) {
          if (requests.isEmpty) {
            return const ContigoEmptyState(
              icon: Icons.inbox_outlined,
              title: 'Aún no hay solicitudes',
              subtitle: 'Las solicitudes de servicio de los clientes aparecerán aquí.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: requests.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) =>
                IncomingRequestCard(request: requests[index]),
          );
        },
      ),
    );
  }
}