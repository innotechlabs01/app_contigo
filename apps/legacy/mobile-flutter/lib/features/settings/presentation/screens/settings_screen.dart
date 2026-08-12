import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/router/routes.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../core/theme/theme_mode.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../widgets/settings_tile.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final themeMode = ref.watch(themeModeControllerProvider);

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        title: const Text(
          'Configuración',
          style: TextStyle(
            fontFamily: 'Lexend',
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Apariencia',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: colors.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                ),
          ),
          const SizedBox(height: 12),
          SegmentedButton<ThemeMode>(
            selected: {themeMode},
            onSelectionChanged: (selected) =>
                ref.read(themeModeControllerProvider.notifier).setMode(selected.first),
            segments: const [
              ButtonSegment(
                value: ThemeMode.system,
                icon: Icon(Icons.brightness_auto_outlined),
                label: Text('Sistema'),
              ),
              ButtonSegment(
                value: ThemeMode.light,
                icon: Icon(Icons.light_mode_outlined),
                label: Text('Claro'),
              ),
              ButtonSegment(
                value: ThemeMode.dark,
                icon: Icon(Icons.dark_mode_outlined),
                label: Text('Oscuro'),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SettingsTile(
            icon: Icons.person,
            title: 'Perfil',
            onTap: () => context.push(AppRoutes.profileDetails),
          ),
          const SizedBox(height: 12),
          SettingsTile(
            icon: Icons.notifications,
            title: 'Notificaciones',
            onTap: () => context.push(AppRoutes.profileNotifications),
          ),
          const SizedBox(height: 12),
          SettingsTile(
            icon: Icons.info,
            title: 'Acerca de',
            onTap: () {},
          ),
          const SizedBox(height: 32),
          ContigoButton(
            variant: ContigoButtonVariant.secondary,
            label: 'Cerrar sesión',
            icon: Icons.logout,
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text(
                    'Cerrar sesión',
                    style: TextStyle(
                      fontFamily: 'Lexend',
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  content: const Text(
                    '¿Estás seguro de que deseas cerrar sesión?',
                    style: TextStyle(
                      fontFamily: 'Lexend',
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: Text(
                        'Cancelar',
                        style: TextStyle(
                          fontFamily: 'Lexend',
                          color: colors.onSurfaceVariant,
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        context.go(AppRoutes.landing);
                      },
                      child: Text(
                        'Confirmar',
                        style: TextStyle(
                          fontFamily: 'Lexend',
                          color: colors.error,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
            height: 56,
          ),
        ],
      ),
    );
  }
}
