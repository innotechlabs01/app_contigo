import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../core/router/routes.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../../shared/widgets/contigo_input.dart';
import '../../../../shared/widgets/contigo_stepper.dart';
import '../../../client/domain/entities/service_type.dart';
import '../../../companion/domain/entities/companion.dart';
import '../../../companion/presentation/view_models/companions_provider.dart';
import '../view_models/register_view_model.dart';

class RegisterScreen extends ConsumerWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentStep = ref.watch(registerStepProvider);
    final submission = ref.watch(registerSubmissionProvider);

    if (submission.value != null) {
      return const _SuccessView();
    }

    return Scaffold(
      backgroundColor: context.contigoColors.surface,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    tooltip: 'Volver',
                    onPressed: () => context.go(AppRoutes.login),
                    icon: const Icon(Icons.arrow_back_rounded),
                  ),
                  Expanded(
                    child: Text(
                      'Crear cuenta',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ContigoStepper(
                currentStep: currentStep,
                totalSteps: 4,
                labels: const ['Tus datos', 'Servicio', 'Acompañante', 'Revisar'],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: submission.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _StepContent(step: currentStep),
            ),
          ],
        ),
      ),
    );
  }
}

class _StepContent extends ConsumerWidget {
  final int step;

  const _StepContent({required this.step});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    switch (step) {
      case 0:
        return const _PersonalDataStep();
      case 1:
        return const _ServiceStep();
      case 2:
        return const _CompanionStep();
      case 3:
        return const _ReviewStep();
      default:
        return const SizedBox.shrink();
    }
  }
}

class _PersonalDataStep extends ConsumerStatefulWidget {
  const _PersonalDataStep();

  @override
  ConsumerState<_PersonalDataStep> createState() => _PersonalDataStepState();
}

class _PersonalDataStepState extends ConsumerState<_PersonalDataStep> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _continue() {
    if (!_formKey.currentState!.validate()) return;
    final form = ref.read(registerFormDataStateProvider.notifier);
    form.updateFullName(_fullNameController.text.trim());
    form.updateEmail(_emailController.text.trim());
    form.updatePhone(_phoneController.text.trim());
    form.updatePassword(_passwordController.text);
    ref.read(registerStepProvider.notifier).next();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Tus datos',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 4),
            Text(
              'Tu cuenta nos ayuda a brindarte un mejor acompañamiento.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
            ),
            SizedBox(height: spacing.lg),
            ContigoInput(
              label: 'Nombre completo',
              controller: _fullNameController,
              prefixIcon: Icons.person_outline_rounded,
              textInputAction: TextInputAction.next,
              validator: (value) {
                if ((value ?? '').trim().isEmpty) return 'Ingresa tu nombre completo';
                return null;
              },
            ),
            SizedBox(height: spacing.md),
            ContigoInput(
              label: 'Correo electrónico',
              controller: _emailController,
              prefixIcon: Icons.mail_outline_rounded,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              validator: (value) {
                final email = value?.trim() ?? '';
                if (email.isEmpty) return 'Ingresa tu correo';
                if (!email.contains('@')) return 'Correo inválido';
                return null;
              },
            ),
            SizedBox(height: spacing.md),
            ContigoInput(
              label: 'Teléfono',
              controller: _phoneController,
              prefixIcon: Icons.phone_outlined,
              keyboardType: TextInputType.phone,
              textInputAction: TextInputAction.next,
              validator: (value) {
                if ((value ?? '').trim().isEmpty) return 'Ingresa tu teléfono';
                return null;
              },
            ),
            SizedBox(height: spacing.md),
            ContigoInput(
              label: 'Contraseña',
              controller: _passwordController,
              prefixIcon: Icons.lock_outline_rounded,
              obscureText: _obscurePassword,
              textInputAction: TextInputAction.next,
              suffixIcon: _visibilityIcon(_obscurePassword, () {
                setState(() => _obscurePassword = !_obscurePassword);
              }),
              validator: (value) {
                if ((value ?? '').length < 6) return 'Mínimo 6 caracteres';
                return null;
              },
            ),
            SizedBox(height: spacing.md),
            ContigoInput(
              label: 'Confirmar contraseña',
              controller: _confirmController,
              prefixIcon: Icons.lock_outline_rounded,
              obscureText: _obscureConfirm,
              suffixIcon: _visibilityIcon(_obscureConfirm, () {
                setState(() => _obscureConfirm = !_obscureConfirm);
              }),
              validator: (value) {
                if ((value ?? '').isEmpty) return 'Confirma tu contraseña';
                if (value != _passwordController.text) return 'Las contraseñas no coinciden';
                return null;
              },
            ),
            SizedBox(height: spacing.xl),
            ContigoButton(
              label: 'Continuar',
              icon: Icons.arrow_forward_rounded,
              onPressed: _continue,
            ),
          ],
        ),
      ),
    );
  }

  Widget? _visibilityIcon(bool obscure, VoidCallback onTap) {
    return IconButton(
      onPressed: onTap,
      icon: Icon(obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
    );
  }
}

class _ServiceStep extends ConsumerWidget {
  const _ServiceStep();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final data = ref.watch(registerFormDataStateProvider);
    final form = ref.read(registerFormDataStateProvider.notifier);
    final step = ref.read(registerStepProvider.notifier);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'El servicio',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 4),
        Text(
          'Cuéntanos qué necesitas.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: colors.onSurfaceVariant,
              ),
        ),
        SizedBox(height: spacing.lg),
        ...ServiceType.mockServices.map(
          (service) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: _SelectableCard(
              selected: data.serviceType == service.id,
              onTap: () {
                form.updateServiceType(service.id);
                step.next();
              },
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: colors.primaryContainer.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(service.icon, color: colors.primary, size: 26),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          service.name,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          service.description,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: colors.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        SizedBox(height: spacing.sm),
        ContigoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _DateField(
                selectedDate: data.preferredDate,
                onTap: () => _pickDate(context, ref),
              ),
              SizedBox(height: spacing.md),
              ContigoInput(
                label: 'Dirección',
                hintText: 'Calle, número, ciudad',
                initialValue: data.address,
                prefixIcon: Icons.location_on_outlined,
                onChanged: form.updateAddress,
              ),
              SizedBox(height: spacing.md),
              ContigoInput(
                label: 'Punto de encuentro (opcional)',
                hintText: 'Ej: Entrada principal',
                initialValue: data.meetingPoint ?? '',
                onChanged: form.updateMeetingPoint,
              ),
              SizedBox(height: spacing.md),
              ContigoInput(
                label: 'Notas (opcional)',
                hintText: 'Detalles que debamos saber',
                initialValue: data.notes,
                maxLines: 3,
                onChanged: form.updateNotes,
              ),
            ],
          ),
        ),
        SizedBox(height: spacing.xl),
        Row(
          children: [
            Expanded(
              child: ContigoButton(
                label: 'Atrás',
                variant: ContigoButtonVariant.secondary,
                onPressed: () => step.previous(),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 2,
              child: ContigoButton(
                label: 'Continuar',
                icon: Icons.arrow_forward_rounded,
                onPressed: data.serviceType.isEmpty ? null : () => step.next(),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _pickDate(BuildContext context, WidgetRef ref) async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      ref.read(registerFormDataStateProvider.notifier).updatePreferredDate(
            DateFormat('dd/MM/yyyy').format(date),
          );
    }
  }
}

class _CompanionStep extends ConsumerStatefulWidget {
  const _CompanionStep();

  @override
  ConsumerState<_CompanionStep> createState() => _CompanionStepState();
}

class _CompanionStepState extends ConsumerState<_CompanionStep> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final companions = ref.watch(companionsProvider);
    final selectedId = ref.watch(registerFormDataStateProvider.select((s) => s.companionId));
    final form = ref.read(registerFormDataStateProvider.notifier);
    final step = ref.read(registerStepProvider.notifier);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: ContigoInput(
            label: '',
            hintText: 'Buscar por nombre, idioma o servicio',
            controller: _searchController,
            prefixIcon: Icons.search_rounded,
            onChanged: (_) => setState(() {}),
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: companions.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => _CompanionsError(
              onRetry: () => ref.invalidate(companionsProvider),
            ),
            data: (list) {
              final filtered = list.where((c) => c.matchesQuery(_searchController.text)).toList();
              if (filtered.isEmpty) {
                return const Center(child: Text('No encontramos acompañantes con ese filtro.'));
              }
              return ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: filtered.length,
                separatorBuilder: (_, _) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final companion = filtered[index];
                  return _CompanionCard(
                    companion: companion,
                    selected: companion.id == selectedId,
                    onTap: () => form.updateCompanionId(companion.id),
                  );
                },
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: ContigoButton(
                  label: 'Atrás',
                  variant: ContigoButtonVariant.secondary,
                  onPressed: () => step.previous(),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ContigoButton(
                  label: 'Continuar',
                  icon: Icons.arrow_forward_rounded,
                  onPressed: selectedId == null ? null : () => step.next(),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _CompanionCard extends StatelessWidget {
  final Companion companion;
  final bool selected;
  final VoidCallback onTap;

  const _CompanionCard({
    required this.companion,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;

    return Material(
      color: selected ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(16),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: colors.primary.withValues(alpha: 0.08),
                blurRadius: 32,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: colors.primaryContainer,
                child: Text(
                  companion.firstName.isNotEmpty
                      ? companion.firstName[0].toUpperCase()
                      : '?',
                  style: TextStyle(
                    color: colors.onPrimaryContainer,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      companion.fullName,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: colors.onSurface,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star_rounded, size: 16, color: Color(0xFFF5A623)),
                        const SizedBox(width: 4),
                        Text(
                          companion.rating.toStringAsFixed(1),
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          companion.experienceLabel,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: colors.onSurfaceVariant,
                              ),
                        ),
                      ],
                    ),
                    if (companion.languages.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        companion.languages.join(' · '),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: colors.onSurfaceVariant,
                            ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CompanionsError extends StatelessWidget {
  final VoidCallback onRetry;

  const _CompanionsError({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cloud_off_rounded, size: 48, color: colors.onSurfaceVariant),
            const SizedBox(height: 16),
            Text(
              'No pudimos cargar los acompañantes.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 24),
            ContigoButton(
              label: 'Reintentar',
              variant: ContigoButtonVariant.secondary,
              onPressed: onRetry,
            ),
          ],
        ),
      ),
    );
  }
}

class _ReviewStep extends ConsumerWidget {
  const _ReviewStep();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final data = ref.watch(registerFormDataStateProvider);
    final submission = ref.watch(registerSubmissionProvider);
    final step = ref.read(registerStepProvider.notifier);
    final submit = ref.read(registerSubmissionProvider.notifier);
    final service = ServiceType.mockServices
        .where((s) => s.id == data.serviceType)
        .firstOrNull;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Revisa tus datos',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 4),
        Text(
          'Confirma que todo esté correcto antes de crear tu cuenta y reservar.',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: colors.onSurfaceVariant,
              ),
        ),
        SizedBox(height: spacing.lg),
        _ReviewSection(
          title: 'Cuenta',
          items: [
            _ReviewItem(label: 'Nombre', value: data.fullName),
            _ReviewItem(label: 'Correo', value: data.email),
            _ReviewItem(label: 'Teléfono', value: data.phone),
          ],
        ),
        SizedBox(height: spacing.md),
        _ReviewSection(
          title: 'Servicio',
          items: [
            _ReviewItem(label: 'Tipo', value: service?.name ?? data.serviceType),
            _ReviewItem(
              label: 'Fecha',
              value: data.preferredDate ?? 'Sin preferencia',
            ),
            _ReviewItem(
              label: 'Dirección',
              value: data.address.isEmpty ? 'No especificada' : data.address,
            ),
            if (data.meetingPoint != null && data.meetingPoint!.isNotEmpty)
              _ReviewItem(label: 'Punto de encuentro', value: data.meetingPoint!),
            if (data.notes.isNotEmpty)
              _ReviewItem(label: 'Notas', value: data.notes),
          ],
        ),
        SizedBox(height: spacing.md),
        _SelectedCompanionSection(companionId: data.companionId),
        if (submission.hasError) ...[
          SizedBox(height: spacing.md),
          Text(
            registerErrorMessage(submission.error!),
            style: TextStyle(color: colors.error),
            textAlign: TextAlign.center,
          ),
        ],
        SizedBox(height: spacing.xl),
        ContigoButton(
          label: 'Crear cuenta y reservar',
          icon: Icons.favorite_rounded,
          isLoading: submission.isLoading,
          onPressed: submission.isLoading ? null : () => submit.submit(data),
        ),
        const SizedBox(height: 12),
        ContigoButton(
          label: 'Editar datos',
          variant: ContigoButtonVariant.secondary,
          onPressed: submission.isLoading ? null : () => step.goTo(0),
        ),
      ],
    );
  }
}

class _SelectedCompanionSection extends ConsumerWidget {
  final String? companionId;

  const _SelectedCompanionSection({required this.companionId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final companions = ref.watch(companionsProvider);

    return _ReviewSection(
      title: 'Tu acompañante',
      items: [
        _ReviewItem(
          label: 'Nombre',
          value: _companionName(companions, companionId),
        ),
      ],
    );
  }

  String _companionName(AsyncValue<List<Companion>> companions, String? id) {
    if (id == null) return 'No seleccionado';
    return companions.value
            ?.where((c) => c.id == id)
            .map((c) => c.fullName)
            .firstOrNull ??
        'No seleccionado';
  }
}

class _ReviewSection extends StatelessWidget {
  final String title;
  final List<_ReviewItem> items;

  const _ReviewSection({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return ContigoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: colors.primary,
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 12),
          ...items,
        ],
      ),
    );
  }
}

class _ReviewItem extends StatelessWidget {
  final String label;
  final String value;

  const _ReviewItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
            ),
          ),
          const SizedBox(width: 8),
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

class _DateField extends StatelessWidget {
  final String? selectedDate;
  final VoidCallback onTap;

  const _DateField({required this.selectedDate, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final radius = context.contigoRadius;
    final spacing = context.contigoSpacing;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(radius.md),
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: spacing.lg,
          vertical: spacing.md,
        ),
        decoration: BoxDecoration(
          color: colors.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(radius.md),
        ),
        child: Row(
          children: [
            Icon(Icons.calendar_today_rounded, size: 20, color: colors.onSurfaceVariant),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Fecha preferida',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: colors.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    selectedDate ?? 'Seleccionar fecha',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: selectedDate == null
                              ? colors.onSurfaceVariant
                              : colors.onSurface,
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: colors.onSurfaceVariant),
          ],
        ),
      ),
    );
  }
}

class _SelectableCard extends StatelessWidget {
  final bool selected;
  final VoidCallback onTap;
  final Widget child;

  const _SelectableCard({
    required this.selected,
    required this.onTap,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;

    return Material(
      color: selected ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: colors.primary.withValues(alpha: 0.08),
                blurRadius: 32,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}

class _SuccessView extends ConsumerWidget {
  const _SuccessView();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final request = ref.watch(registerSubmissionProvider).value;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  height: 88,
                  width: 88,
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check_rounded, size: 48, color: Color(0xFF00668A)),
                ),
                const SizedBox(height: 24),
                Text(
                  '¡Cuenta creada y reserva enviada!',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                        color: colors.onSurface,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  'Tu acompañante recibirá la solicitud y te contactará. Podrás ver su estado en "Mis solicitudes".',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: colors.onSurfaceVariant,
                      ),
                  textAlign: TextAlign.center,
                ),
                if (request != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    'Referencia: ${request.id}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: colors.onSurfaceVariant,
                        ),
                  ),
                ],
                SizedBox(height: spacing.xxl),
                ContigoButton(
                  label: 'Ver mis solicitudes',
                  icon: Icons.list_alt_rounded,
                  onPressed: () {
                    ref.read(registerSubmissionProvider.notifier).reset();
                    ref.read(registerStepProvider.notifier).goTo(0);
                    context.go(AppRoutes.requests);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
