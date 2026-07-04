import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../widgets/request_card.dart';
import '../widgets/filter_bottom_sheet.dart';
import '../view_models/my_requests_view_model.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';

class MyRequestsScreen extends ConsumerWidget {
  const MyRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestsAsync = ref.watch(myRequestsListProvider);
    final activeFilter = ref.watch(myRequestsFilterProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Solicitudes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () async {
              final filter = await showFilterBottomSheet(context);
              if (context.mounted) {
                if (filter == null) {
                  ref.read(myRequestsFilterProvider.notifier).clear();
                } else {
                  ref.read(myRequestsFilterProvider.notifier).apply(filter);
                }
              }
            },
          ),
        ],
      ),
      body: requestsAsync.when(
        data: (requests) {
          var filtered = requests;
          if (activeFilter != null) {
            filtered = requests
                .where((r) => r.status.name == activeFilter)
                .toList();
          }

          if (filtered.isEmpty) {
            return ContigoEmptyState(
              icon: Icons.inbox_outlined,
              title: activeFilter != null
                  ? 'No hay solicitudes con este filtro'
                  : 'No tienes solicitudes aún',
              subtitle: activeFilter != null
                  ? 'Prueba con otro filtro'
                  : 'Las solicitudes que crees aparecerán aquí',
              actionLabel: activeFilter != null ? 'Limpiar filtro' : null,
              onAction: activeFilter != null
                  ? () => ref.read(myRequestsFilterProvider.notifier).clear()
                  : null,
            );
          }

          return RefreshIndicator(
            onRefresh: () =>
                ref.refresh(myRequestsListProvider.future),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (_, _) => const SizedBox(height: 12),
              itemBuilder: (context, index) => RequestCard(
                request: filtered[index],
              ),
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
