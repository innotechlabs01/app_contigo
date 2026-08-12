import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';

class CalendarTab extends ConsumerWidget {
  const CalendarTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(title: const Text('Calendario')),
      body: const ContigoEmptyState(
        icon: Icons.calendar_month_outlined,
        title: 'Tu agenda está vacía',
        subtitle:
            'Tus acompañamientos y citas programadas aparecerán aquí en un calendario.',
      ),
    );
  }
}
