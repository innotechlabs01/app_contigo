import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';
import '../view_models/companion_requests_view_model.dart';
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
              subtitle:
                  'Las solicitudes de servicio de los clientes aparecerán aquí.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: requests.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) =>
                IncomingRequestCard(request: requests[index]),
          );
        },
      ),
    );
  }
}
