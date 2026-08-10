import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/routes.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_input.dart';
import '../view_models/auth_view_model.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final user = await ref
        .read(loginViewModelProvider.notifier)
        .signInWithEmail(
          email: _emailController.text,
          password: _passwordController.text,
        );

    if (!mounted || user == null) return;

    context.go(user.isCompanion ? AppRoutes.companionHome : AppRoutes.home);
  }

  @override
  Widget build(BuildContext context) {
    final loginState = ref.watch(loginViewModelProvider);
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(spacing.lg),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: (MediaQuery.sizeOf(context).height -
                      MediaQuery.paddingOf(context).vertical -
                      spacing.lg * 2)
                  .clamp(0, double.infinity),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    tooltip: 'Volver',
                    onPressed: () => context.go(AppRoutes.landing),
                    icon: const Icon(Icons.arrow_back_rounded),
                  ),
                ),
                SizedBox(height: spacing.xl),
                Container(
                  height: 72,
                  width: 72,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    borderRadius: BorderRadius.circular(radius.xl),
                  ),
                  child: Icon(
                    Icons.favorite_rounded,
                    color: colors.onPrimaryContainer,
                    size: 34,
                  ),
                ),
                SizedBox(height: spacing.xl),
                Text(
                  'Ingresa a App Contigo',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: colors.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: spacing.sm),
                Text(
                  'Usa tus datos para continuar. Si aún no tienes cuenta, regístrate para crear tu perfil.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
                SizedBox(height: spacing.xl),
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      ContigoInput(
                        label: 'Correo',
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: Icons.mail_outline_rounded,
                        validator: (value) {
                          final email = value?.trim() ?? '';
                          if (email.isEmpty) return 'Ingresa tu correo';
                          if (!email.contains('@')) return 'Correo inválido';
                          return null;
                        },
                      ),
                      SizedBox(height: spacing.md),
                      ContigoInput(
                        label: 'Contraseña',
                        controller: _passwordController,
                        obscureText: true,
                        prefixIcon: Icons.lock_outline_rounded,
                        validator: (value) {
                          if ((value ?? '').length < 6) {
                            return 'Mínimo 6 caracteres';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                if (loginState.hasError) ...[
                  SizedBox(height: spacing.md),
                  Text(
                    'No pudimos iniciar sesión. Revisa los datos e intenta de nuevo.',
                    style: TextStyle(color: colors.error),
                  ),
                ],
                SizedBox(height: spacing.xl),
                ContigoButton(
                  label: 'Ingresar',
                  icon: Icons.login_rounded,
                  isLoading: loginState.isLoading,
                  onPressed: loginState.isLoading ? null : _submit,
                ),
                SizedBox(height: spacing.md),
                ContigoButton(
                  variant: ContigoButtonVariant.secondary,
                  label: 'Crear cuenta',
                  icon: Icons.person_add_alt_1_rounded,
                  onPressed: () => context.go(AppRoutes.register),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
