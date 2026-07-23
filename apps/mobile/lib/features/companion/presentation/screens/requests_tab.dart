import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';

class CompanionRequestsTab extends ConsumerWidget {
  const CompanionRequestsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(title: const Text('Solicitudes')),
      body: const ContigoEmptyState(
        icon: Icons.inbox_outlined,
        title: 'Aún no hay solicitudes',
        subtitle:
            'Las solicitudes de servicio de los clientes aparecerán aquí cuando se reciban.',
      ),
    );
  }
}
