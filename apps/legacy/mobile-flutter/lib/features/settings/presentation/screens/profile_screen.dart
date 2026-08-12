import 'package:flutter/material.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_button.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final radius = context.contigoRadius;
    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        title: const Text(
          'Perfil',
          style: TextStyle(
            fontFamily: 'Lexend',
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 24),
            CircleAvatar(
              radius: 48,
              backgroundColor: colors.primaryContainer,
              child: Icon(Icons.person, size: 48, color: colors.primary),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () {},
              child: Text(
                'Cambiar foto',
                style: TextStyle(
                  fontFamily: 'Lexend',
                  fontWeight: FontWeight.w300,
                  color: colors.primary,
                ),
              ),
            ),
            const SizedBox(height: 32),
            TextFormField(
              controller: _nameController,
              style: TextStyle(
                fontFamily: 'Lexend',
                color: colors.onSurface,
              ),
              decoration: InputDecoration(
                labelText: 'Nombre completo',
                labelStyle: TextStyle(
                  fontFamily: 'Lexend',
                  color: colors.onSurfaceVariant,
                ),
                filled: true,
                fillColor: colors.surfaceContainer,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(radius.lg),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              style: TextStyle(
                fontFamily: 'Lexend',
                color: colors.onSurface,
              ),
              decoration: InputDecoration(
                labelText: 'Correo electrónico',
                labelStyle: TextStyle(
                  fontFamily: 'Lexend',
                  color: colors.onSurfaceVariant,
                ),
                filled: true,
                fillColor: colors.surfaceContainer,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(radius.lg),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              style: TextStyle(
                fontFamily: 'Lexend',
                color: colors.onSurface,
              ),
              decoration: InputDecoration(
                labelText: 'Teléfono',
                labelStyle: TextStyle(
                  fontFamily: 'Lexend',
                  color: colors.onSurfaceVariant,
                ),
                filled: true,
                fillColor: colors.surfaceContainer,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(radius.lg),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 32),
            ContigoButton(
              variant: ContigoButtonVariant.primary,
              label: 'Guardar Cambios',
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text(
                      'Perfil actualizado',
                      style: TextStyle(fontFamily: 'Lexend'),
                    ),
                  ),
                );
              },
              height: 56,
            ),
          ],
        ),
      ),
    );
  }
}
