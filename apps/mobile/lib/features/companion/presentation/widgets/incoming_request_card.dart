import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../client/domain/entities/service_request.dart';
import '../../../client/domain/entities/request_status.dart';
import '../view_models/companion_requests_view_model.dart';

class IncomingRequestCard extends ConsumerWidget {
  final ServiceRequest request;

  const IncomingRequestCard({super.key, required this.request});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final isPending = request.status == RequestStatus.pending;

    return ContigoCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.person, color: colors.primary, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  request.fullName,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: colors.onSurface,
                      ),
                ),
              ),
              _StatusBadge(status: request.status),
            ],
          ),
          const SizedBox(height: 12),
          _InfoRow(icon: Icons.category, label: request.serviceType),
          if (request.address != null)
            _InfoRow(icon: Icons.location_on, label: request.address!),
          if (request.preferredDate != null)
            _InfoRow(icon: Icons.calendar_today, label: request.preferredDate!),
          if (request.notes != null && request.notes!.isNotEmpty)
            _InfoRow(icon: Icons.notes, label: request.notes!),
          if (isPending) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ContigoButton(
                    label: 'Rechazar',
                    variant: ContigoButtonVariant.secondary,
                    onPressed: () => ref.read(requestActionProvider.notifier).reject(request.id),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ContigoButton(
                    label: 'Aceptar',
                    onPressed: () => ref.read(requestActionProvider.notifier).accept(request.id),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoRow({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(icon, size: 14, color: colors.onSurfaceVariant),
          const SizedBox(width: 8),
          Expanded(
            child: Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: colors.onSurfaceVariant,
            )),
          ),
        ],
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final RequestStatus status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final (label, bgColor, textColor) = switch (status) {
      RequestStatus.pending => ('Pendiente', colors.tertiaryContainer, colors.onTertiaryContainer),
      RequestStatus.accepted => ('Aceptada', colors.primaryContainer, colors.onPrimaryContainer),
      RequestStatus.rejected => ('Rechazada', colors.errorContainer, colors.onErrorContainer),
      _ => ('', colors.surfaceContainer, colors.onSurfaceVariant),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(label, style: TextStyle(fontSize: 12, color: textColor)),
    );
  }
}
