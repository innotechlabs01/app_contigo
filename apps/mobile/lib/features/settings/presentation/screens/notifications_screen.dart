import 'package:flutter/material.dart';

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
    return Scaffold(
      appBar: AppBar(title: const Text('Notificaciones')),
      body: ListView(
        children: [
          SwitchListTile(
            title: const Text('Notificaciones push'),
            subtitle: const Text('Recibe notificaciones en tu dispositivo'),
            value: _pushEnabled,
            onChanged: (v) => setState(() => _pushEnabled = v),
            activeTrackColor: const Color(0xFF00668A),
          ),
          SwitchListTile(
            title: const Text('Correo electrónico'),
            subtitle: const Text('Recibe notificaciones por email'),
            value: _emailEnabled,
            onChanged: (v) => setState(() => _emailEnabled = v),
            activeTrackColor: const Color(0xFF00668A),
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text('Recordatorios', style: TextStyle(fontWeight: FontWeight.w600)),
          ),
          SwitchListTile(
            title: const Text('Recordatorios de sesión'),
            subtitle: const Text('Recibe recordatorios antes de tus sesiones'),
            value: _sessionReminders,
            onChanged: (v) => setState(() => _sessionReminders = v),
            activeTrackColor: const Color(0xFF00668A),
          ),
        ],
      ),
    );
  }
}
