import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../view_models/request_form_view_model.dart';
import '../../../../shared/widgets/contigo_stepper.dart';
import '../../../../shared/widgets/contigo_input.dart';
import '../../../../core/router/routes.dart';

class RequestFormScreen extends ConsumerWidget {
  const RequestFormScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentStep = ref.watch(requestFormStepProvider);
    final submission = ref.watch(requestSubmissionProvider);

    if (submission.value != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Solicitud Enviada')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.check_circle, size: 80, color: Colors.green),
                const SizedBox(height: 24),
                Text(
                  '¡Solicitud enviada con éxito!',
                  style: Theme.of(context).textTheme.headlineSmall,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  'ID: ${submission.value!.id}',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      ref.read(requestSubmissionProvider.notifier).reset();
                      ref.read(requestFormStepProvider.notifier).goTo(0);
                      context.go(AppRoutes.requests);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00668A),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(56),
                      ),
                    ),
                    child: const Text('Ver mis solicitudes'),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Nueva Solicitud'),
        actions: [
          TextButton(
            onPressed: () => context.go(AppRoutes.services),
            child: const Text('Cancelar'),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: ContigoStepper(
              currentStep: currentStep,
              totalSteps: 4,
              labels: const ['Servicio', 'Datos', 'Agenda', 'Revisar'],
            ),
          ),
          Expanded(
            child: submission.isLoading
                ? const Center(child: CircularProgressIndicator())
                : _buildStepContent(context, ref, currentStep),
          ),
        ],
      ),
    );
  }

  Widget _buildStepContent(BuildContext context, WidgetRef ref, int step) {
    switch (step) {
      case 0:
        return _ServiceTypeSelector();
      case 1:
        return _PersonalDataForm();
      case 2:
        return _ScheduleForm();
      case 3:
        return _ReviewForm();
      default:
        return const SizedBox.shrink();
    }
  }
}

class _ServiceTypeSelector extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selected = ref.watch(requestFormDataStateProvider.select((s) => s.serviceType));
    final form = ref.read(requestFormDataStateProvider.notifier);

    final services = [
      'Acompañamiento Médico',
      'Compañía Diaria',
      'Trámites y Gestiones',
    ];
    final icons = [
      Icons.medical_services,
      Icons.people,
      Icons.assignment,
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Selecciona el tipo de servicio',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        ...List.generate(services.length, (i) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Material(
            color: selected == services[i]
                ? const Color(0xFF00668A).withValues(alpha: 0.1)
                : const Color(0xFFF3F3F3),
            borderRadius: BorderRadius.circular(16),
            child: InkWell(
              onTap: () {
                form.updateServiceType(services[i]);
                ref.read(requestFormStepProvider.notifier).next();
              },
              borderRadius: BorderRadius.circular(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Icon(
                      icons[i],
                      color: const Color(0xFF00668A),
                      size: 28,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        services[i],
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                    if (selected == services[i])
                      const Icon(
                        Icons.check_circle,
                        color: Color(0xFF00668A),
                      ),
                  ],
                ),
              ),
            ),
          ),
        )),
      ],
    );
  }
}

class _PersonalDataForm extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(requestFormDataStateProvider);
    final form = ref.read(requestFormDataStateProvider.notifier);
    final step = ref.read(requestFormStepProvider.notifier);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Tus datos personales',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 24),
        ContigoInput(
          label: 'Nombre completo',
          initialValue: data.fullName,
          onChanged: form.updateFullName,
        ),
        const SizedBox(height: 16),
        ContigoInput(
          label: 'Teléfono',
          initialValue: data.phone,
          onChanged: form.updatePhone,
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 16),
        ContigoInput(
          label: 'Dirección (opcional)',
          initialValue: data.address,
          onChanged: form.updateAddress,
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 56,
                child: OutlinedButton(
                  onPressed: () => step.previous(),
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(56),
                    ),
                  ),
                  child: const Text('Atrás'),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 2,
              child: SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: () => step.next(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00668A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(56),
                    ),
                  ),
                  child: const Text('Siguiente'),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _ScheduleForm extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(requestFormDataStateProvider);
    final form = ref.read(requestFormDataStateProvider.notifier);
    final step = ref.read(requestFormStepProvider.notifier);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Agenda tu servicio',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: DateTime.now().add(const Duration(days: 1)),
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 365)),
              );
              if (date != null) {
                form.updatePreferredDate(DateFormat('dd/MM/yyyy').format(date));
              }
            },
            icon: const Icon(Icons.calendar_today),
            label: Text(
              data.preferredDate ?? 'Seleccionar fecha preferida',
            ),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        ContigoInput(
          label: 'Notas adicionales (opcional)',
          initialValue: data.notes,
          onChanged: form.updateNotes,
          maxLines: 3,
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 56,
                child: OutlinedButton(
                  onPressed: () => step.previous(),
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(56),
                    ),
                  ),
                  child: const Text('Atrás'),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 2,
              child: SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: () => step.next(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00668A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(56),
                    ),
                  ),
                  child: const Text('Revisar'),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _ReviewForm extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(requestFormDataStateProvider);
    final step = ref.read(requestFormStepProvider.notifier);
    final submission = ref.read(requestSubmissionProvider.notifier);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Revisa tu solicitud',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 24),
        _ReviewItem(label: 'Servicio', value: data.serviceType),
        _ReviewItem(
          label: 'Nombre',
          value: data.fullName,
        ),
        _ReviewItem(
          label: 'Teléfono',
          value: data.phone.isEmpty ? 'No especificado' : data.phone,
        ),
        _ReviewItem(
          label: 'Dirección',
          value: data.address.isEmpty ? 'No especificada' : data.address,
        ),
        _ReviewItem(
          label: 'Fecha',
          value: (data.preferredDate?.isNotEmpty ?? false) ? data.preferredDate! : 'No especificada',
        ),
        if (data.notes.isNotEmpty)
          _ReviewItem(label: 'Notas', value: data.notes),
        const SizedBox(height: 32),
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: () => submission.submit(data),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF00668A),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(56),
              ),
            ),
            child: const Text('Enviar Solicitud'),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          height: 56,
          child: OutlinedButton(
            onPressed: () => step.previous(),
            style: OutlinedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(56),
              ),
            ),
            child: const Text('Editar'),
          ),
        ),
      ],
    );
  }
}

class _ReviewItem extends StatelessWidget {
  final String label;
  final String value;

  const _ReviewItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
