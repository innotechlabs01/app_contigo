import 'package:flutter/material.dart';

import '../../../../shared/widgets/contigo_empty_state.dart';

class CompanionRequestsTab extends StatelessWidget {
  const CompanionRequestsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Solicitudes')),
      body: const ContigoEmptyState(
        icon: Icons.inbox_outlined,
        title: 'No hay solicitudes',
        subtitle:
            'Las solicitudes de servicio de clientes aparecerán aquí',
      ),
    );
  }
}
