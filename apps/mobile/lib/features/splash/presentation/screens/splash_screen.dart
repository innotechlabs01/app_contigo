import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/routes.dart';
import '../../../../core/theme/extensions.dart';
import '../../../auth/presentation/view_models/auth_view_model.dart';
import '../../../intro/presentation/view_models/intro_view_model.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _resolveFlow());
  }

  Future<void> _resolveFlow() async {
    final introCompleted = ref.read(introStatusProvider);
    final user = await ref.read(authStateProvider.future);

    if (!mounted) return;

    if (!introCompleted) {
      context.go(AppRoutes.intro);
    } else if (user == null) {
      context.go(AppRoutes.login);
    } else {
      context.go(user.isCompanion ? AppRoutes.companionHome : AppRoutes.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: Center(
          child: Semantics(
            label: 'Cargando App Contigo',
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  height: 88,
                  width: 88,
                  decoration: BoxDecoration(
                    color: colors.primaryContainer,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.favorite_rounded,
                    color: colors.onPrimaryContainer,
                    size: 42,
                  ),
                ),
                SizedBox(height: spacing.lg),
                Text(
                  'App Contigo',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: colors.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: spacing.md),
                SizedBox(
                  height: 28,
                  width: 28,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: colors.primary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
