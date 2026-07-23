import 'package:flutter/material.dart';
import '../../../../core/theme/extensions.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _pushEnabled = true;
  bool _emailEnabled = true;
  bool _sessionReminders = true;

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        title: const Text(
          'Notificaciones',
          style: TextStyle(
            fontFamily: 'Lexend',
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSwitchCard(
            title: 'Notificaciones Push',
            value: _pushEnabled,
            onChanged: (v) => setState(() => _pushEnabled = v),
          ),
          const SizedBox(height: 12),
          _buildSwitchCard(
            title: 'Notificaciones por Email',
            value: _emailEnabled,
            onChanged: (v) => setState(() => _emailEnabled = v),
          ),
          const SizedBox(height: 12),
          _buildSwitchCard(
            title: 'Recordatorios de Citas',
            value: _sessionReminders,
            onChanged: (v) => setState(() => _sessionReminders = v),
          ),
        ],
      ),
    );
  }

  Widget _buildSwitchCard({
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    final colors = context.contigoColors;
    return Container(
      decoration: BoxDecoration(
        color: colors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.outlineVariant, width: 0.5),
      ),
      child: SwitchListTile(
        title: Text(
          title,
          style: const TextStyle(
            fontFamily: 'Lexend',
            fontWeight: FontWeight.w300,
          ),
        ),
        value: value,
        onChanged: onChanged,
        activeTrackColor: colors.primaryContainer,
        activeThumbColor: colors.primary,
      ),
    );
  }
}
