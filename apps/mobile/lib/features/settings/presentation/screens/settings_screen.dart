import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/routes.dart';
import '../widgets/settings_tile.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Configuración')),
      body: ListView(
        children: [
          const SizedBox(height: 8),
          SettingsTile(
            icon: Icons.person,
            title: 'Perfil',
            subtitle: 'Edita tu información personal',
            onTap: () => context.go(AppRoutes.settingsProfile),
          ),
          const Divider(),
          SettingsTile(
            icon: Icons.notifications,
            title: 'Notificaciones',
            subtitle: 'Administra tus preferencias',
            onTap: () => context.go(AppRoutes.settingsNotifications),
          ),
          const Divider(),
          SettingsTile(
            icon: Icons.info_outline,
            title: 'Acerca de Contigo',
            subtitle: 'Versión 1.0.0',
            onTap: () {},
          ),
          const Divider(),
          const SizedBox(height: 32),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: double.infinity, height: 56,
              child: OutlinedButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Cerrar sesión'),
                      content: const Text('¿Estás seguro de que deseas cerrar sesión?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('Cancelar'),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pop(ctx);
                          },
                          child: const Text('Confirmar', style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    ),
                  );
                },
                icon: const Icon(Icons.logout, color: Colors.red),
                label: const Text('Cerrar sesión', style: TextStyle(color: Colors.red)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(56)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
