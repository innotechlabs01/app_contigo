import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/routes.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_input.dart';
import '../widgets/meeting_point_search_widget.dart';
import '../../domain/entities/meeting_point.dart';
import '../view_models/request_form_view_model.dart';

class _CategoryData {
  final IconData icon;
  final String title;
  final String subtitle;

  const _CategoryData(this.icon, this.title, this.subtitle);
}

const _categories = [
  _CategoryData(Icons.medical_services, 'Salud', 'Cita Medica'),
  _CategoryData(Icons.shopping_basket, 'Logistica', 'Recados Personales'),
  _CategoryData(Icons.medication, 'Farmacia', 'Medicamentos'),
  _CategoryData(Icons.directions_car, 'Movilidad', 'Acompanamiento Vehicular'),
];

class ServicesScreen extends ConsumerStatefulWidget {
  const ServicesScreen({super.key});

  @override
  ConsumerState<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends ConsumerState<ServicesScreen> {
  int _selectedCategory = -1;
  String? _date;
  String? _time;
  String? _location;
  MeetingPoint? _selectedMeetingPoint;
  final _fullNameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();

  void _onCategorySelected(int index) {
    setState(() => _selectedCategory = index);
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: now,
      lastDate: DateTime(now.year + 1),
      builder: (context, child) {
        return Theme(data: Theme.of(context), child: child!);
      },
    );
    if (picked != null) {
      setState(() {
        _date =
            '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
      });
    }
  }

  Future<void> _pickTime() async {
    final now = TimeOfDay.now();
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(hour: now.hour + 1, minute: 0),
      builder: (context, child) {
        return Theme(data: Theme.of(context), child: child!);
      },
    );
    if (picked != null) {
      setState(() {
        _time =
            '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
      });
    }
  }

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  Future<void> _submitRequest() async {
    if (_selectedCategory < 0) return;
    if (_fullNameCtrl.text.trim().isEmpty) return;
    if (_phoneCtrl.text.trim().isEmpty) return;

    final meetingPoint = _selectedMeetingPoint?.address ?? _location;
    final dateStr = <String>[?_date, ?_time].join(' ');

    await ref
        .read(requestSubmissionProvider.notifier)
        .submit(
          RequestFormData(
            serviceType: _categories[_selectedCategory].title,
            fullName: _fullNameCtrl.text.trim(),
            phone: _phoneCtrl.text.trim(),
            address: _addressCtrl.text.trim(),
            meetingPoint: meetingPoint,
            preferredDate: dateStr.isNotEmpty ? dateStr : null,
            notes: _notesCtrl.text.trim(),
          ),
        );

    if (!mounted) return;
    context.push(AppRoutes.requests);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(
            horizontal: spacing.lg,
            vertical: spacing.md,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildAppBar(colors, typography),
              SizedBox(height: spacing.lg),
              _buildTitle(colors, typography),
              SizedBox(height: spacing.sm),
              _buildSubtitle(colors, typography),
              SizedBox(height: spacing.xl),
              _buildCategoryGrid(colors, typography, radius, spacing),
              SizedBox(height: spacing.xl),
              _buildSectionDivider(colors),
              SizedBox(height: spacing.lg),
              _buildSectionHeader(colors, typography),
              SizedBox(height: spacing.lg),
              _buildContactFields(colors, radius, spacing),
              SizedBox(height: spacing.xl),
              _buildDateTimeSection(colors, typography, radius, spacing),
              SizedBox(height: spacing.xl),
              _buildLocationSection(colors, typography, radius, spacing),
              SizedBox(height: spacing.xl),
              _buildCompanionSection(colors, typography, radius, spacing),
              SizedBox(height: spacing.xl),
              _buildNotesField(colors, radius, spacing),
              SizedBox(height: spacing.xl),
              _buildSubmitButton(colors, typography, radius),
              SizedBox(height: spacing.md),
              _buildFooter(colors, typography),
              SizedBox(height: spacing.lg),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContactFields(
    ContigoColors colors,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.person, size: 20, color: colors.primary),
            SizedBox(width: spacing.sm),
            Text(
              'Tus datos',
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(color: colors.onSurface),
            ),
          ],
        ),
        SizedBox(height: spacing.md),
        ContigoInput(
          label: 'Nombre completo',
          controller: _fullNameCtrl,
          prefixIcon: Icons.person_outline,
          keyboardType: TextInputType.name,
        ),
        SizedBox(height: spacing.md),
        ContigoInput(
          label: 'Teléfono',
          controller: _phoneCtrl,
          prefixIcon: Icons.phone_outlined,
          keyboardType: TextInputType.phone,
        ),
        SizedBox(height: spacing.md),
        ContigoInput(
          label: 'Dirección',
          controller: _addressCtrl,
          prefixIcon: Icons.home_outlined,
          keyboardType: TextInputType.streetAddress,
        ),
      ],
    );
  }

  Widget _buildNotesField(
    ContigoColors colors,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.notes, size: 20, color: colors.primary),
            SizedBox(width: spacing.sm),
            Text(
              'Notas adicionales',
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(color: colors.onSurface),
            ),
          ],
        ),
        SizedBox(height: spacing.md),
        ContigoInput(
          label: 'Notas (opcional)',
          controller: _notesCtrl,
          prefixIcon: Icons.edit_note,
          maxLines: 3,
        ),
      ],
    );
  }

  Widget _buildAppBar(ContigoColors colors, ContigoTypography typography) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Solicitar Servicio',
          style: typography.headlineSmall.copyWith(color: colors.onSurface),
        ),
        Row(
          children: [
            IconButton(
              icon: Icon(Icons.add, color: colors.onSurface),
              onPressed: () {},
            ),
            IconButton(
              icon: Icon(Icons.notifications, color: colors.onSurface),
              onPressed: () {},
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTitle(ContigoColors colors, ContigoTypography typography) {
    return Text(
      'Como podemos ayudarte hoy?',
      style: typography.headlineMedium.copyWith(color: colors.onSurface),
    );
  }

  Widget _buildSubtitle(ContigoColors colors, ContigoTypography typography) {
    return Text(
      'Selecciona la categoria de servicio que necesitas',
      style: typography.bodyMedium.copyWith(
        color: colors.onSurfaceVariant,
        fontWeight: FontWeight.w300,
      ),
    );
  }

  Widget _buildCategoryGrid(
    ContigoColors colors,
    ContigoTypography typography,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.1,
      ),
      itemCount: _categories.length,
      itemBuilder: (context, index) {
        final category = _categories[index];
        final isSelected = _selectedCategory == index;

        return GestureDetector(
          onTap: () => _onCategorySelected(index),
          child: AnimatedContainer(
            duration: context.contigoMotion.normal,
            curve: context.contigoMotion.spring,
            decoration: BoxDecoration(
              color: isSelected
                  ? colors.primary.withValues(alpha: 0.15)
                  : colors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(radius.lg),
              border: Border.all(
                color: isSelected ? colors.primary : colors.outlineVariant,
                width: 1,
              ),
            ),
            padding: EdgeInsets.all(spacing.md),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  category.icon,
                  size: 36,
                  color: isSelected ? colors.primary : colors.onSurfaceVariant,
                ),
                SizedBox(height: spacing.sm),
                Text(
                  category.title,
                  style: typography.titleSmall.copyWith(
                    color: isSelected ? colors.primary : colors.onSurface,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: spacing.xs),
                Text(
                  category.subtitle,
                  style: typography.bodySmall.copyWith(
                    color: isSelected
                        ? colors.primary.withValues(alpha: 0.7)
                        : colors.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSectionDivider(ContigoColors colors) {
    return Divider(
      color: colors.outlineVariant.withValues(alpha: 0.5),
      height: 1,
    );
  }

  Widget _buildSectionHeader(
    ContigoColors colors,
    ContigoTypography typography,
  ) {
    return Text(
      'Detalles del Servicio',
      style: typography.titleLarge.copyWith(color: colors.onSurface),
    );
  }

  Widget _buildDateTimeSection(
    ContigoColors colors,
    ContigoTypography typography,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.calendar_today, size: 20, color: colors.primary),
            SizedBox(width: spacing.sm),
            Text(
              'Cuando lo necesitas?',
              style: typography.titleSmall.copyWith(color: colors.onSurface),
            ),
          ],
        ),
        SizedBox(height: spacing.md),
        Row(
          children: [
            Expanded(
              child: _TapCard(
                onTap: _pickDate,
                icon: Icons.calendar_month,
                label: _date ?? 'Seleccionar fecha',
                hasValue: _date != null,
              ),
            ),
            SizedBox(width: spacing.md),
            Expanded(
              child: _TapCard(
                onTap: _pickTime,
                icon: Icons.schedule,
                label: _time ?? 'Seleccionar hora',
                hasValue: _time != null,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLocationSection(
    ContigoColors colors,
    ContigoTypography typography,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.location_on, size: 20, color: colors.primary),
            SizedBox(width: spacing.sm),
            Text(
              'Donde sera el punto de encuentro?',
              style: typography.titleSmall.copyWith(color: colors.onSurface),
            ),
          ],
        ),
        SizedBox(height: spacing.md),
        MeetingPointSearchWidget(
          onMeetingPointSelected: (point) {
            setState(() => _selectedMeetingPoint = point);
          },
        ),
      ],
    );
  }

  Widget _buildCompanionSection(
    ContigoColors colors,
    ContigoTypography typography,
    ContigoRadius radius,
    ContigoSpacing spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Tu Acompanante Favorito',
              style: typography.titleSmall.copyWith(color: colors.onSurface),
            ),
            TextButton(
              onPressed: () {},
              child: Text(
                'Cambiar',
                style: typography.labelMedium.copyWith(color: colors.primary),
              ),
            ),
          ],
        ),
        SizedBox(height: spacing.sm),
        Container(
          decoration: BoxDecoration(
            color: colors.surfaceContainerLow,
            borderRadius: BorderRadius.circular(radius.lg),
            border: Border.all(color: colors.outlineVariant, width: 1),
          ),
          padding: EdgeInsets.all(spacing.md),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: colors.primaryContainer,
                child: Text(
                  'MG',
                  style: typography.titleMedium.copyWith(
                    color: colors.onPrimaryContainer,
                  ),
                ),
              ),
              SizedBox(width: spacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Marta Gonzalez',
                      style: typography.titleSmall.copyWith(
                        color: colors.onSurface,
                      ),
                    ),
                    SizedBox(height: spacing.xs),
                    Row(
                      children: [
                        Icon(Icons.star, size: 14, color: colors.secondary),
                        SizedBox(width: 2),
                        Text(
                          '4.9',
                          style: typography.bodySmall.copyWith(
                            color: colors.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: EdgeInsets.symmetric(
                  horizontal: spacing.sm,
                  vertical: spacing.xs,
                ),
                decoration: BoxDecoration(
                  color: colors.primaryContainer.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(radius.full),
                ),
                child: Text(
                  'Disponible',
                  style: typography.labelSmall.copyWith(color: colors.primary),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSubmitButton(
    ContigoColors colors,
    ContigoTypography typography,
    ContigoRadius radius,
  ) {
    return ContigoButton(
      variant: ContigoButtonVariant.primary,
      label: 'Enviar Solicitud',
      onPressed: _submitRequest,
      height: 56,
    );
  }

  Widget _buildFooter(ContigoColors colors, ContigoTypography typography) {
    return Center(
      child: Text(
        'CALIDAD CONTIGO',
        style: typography.labelSmall.copyWith(
          color: colors.onSurfaceVariant.withValues(alpha: 0.4),
          letterSpacing: 4,
        ),
      ),
    );
  }
}

class _TapCard extends StatelessWidget {
  final VoidCallback onTap;
  final IconData icon;
  final String label;
  final bool hasValue;

  const _TapCard({
    required this.onTap,
    required this.icon,
    required this.label,
    required this.hasValue,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final radius = context.contigoRadius;
    final spacing = context.contigoSpacing;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: spacing.md,
          vertical: spacing.md,
        ),
        decoration: BoxDecoration(
          color: hasValue
              ? colors.primary.withValues(alpha: 0.1)
              : colors.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(radius.lg),
          border: Border.all(
            color: hasValue ? colors.primary : colors.outlineVariant,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: hasValue ? colors.primary : colors.onSurfaceVariant,
            ),
            SizedBox(width: spacing.sm),
            Expanded(
              child: Text(
                label,
                style: typography.bodySmall.copyWith(
                  color: hasValue ? colors.primary : colors.onSurfaceVariant,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
