import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../features/auth/presentation/view_models/auth_view_model.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/client/presentation/screens/my_requests_screen.dart';
import '../../features/client/presentation/screens/services_screen.dart';
import '../../features/companion/presentation/screens/calendar_tab.dart';
import '../../features/companion/presentation/screens/companion_shell.dart';
import '../../features/companion/presentation/screens/earnings_tab.dart';
import '../../features/companion/presentation/screens/home_tab.dart';
import '../../features/companion/presentation/screens/requests_tab.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/intro/presentation/screens/intro_screen.dart';
import '../../features/intro/presentation/view_models/intro_view_model.dart';
import '../../features/landing/presentation/screens/landing_screen.dart';
import '../../features/splash/presentation/screens/splash_screen.dart';
import '../../features/settings/presentation/screens/notifications_screen.dart';
import '../../features/settings/presentation/screens/profile_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';
import 'app_shell.dart';
import 'guards.dart';
import 'routes.dart';

part 'router.g.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

class RouterRefreshNotifier extends ChangeNotifier {
  void notify() => notifyListeners();
}

@Riverpod(keepAlive: true)
RouterRefreshNotifier routerRefreshNotifier(Ref ref) {
  final notifier = RouterRefreshNotifier();
  ref.listen(authStateProvider, (_, __) => notifier.notify());
  ref.listen(authGuardProvider, (_, __) => notifier.notify());
  ref.listen(introStatusProvider, (_, __) => notifier.notify());
  return notifier;
}

@riverpod
GoRouter router(Ref ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: AppRoutes.splash,
    refreshListenable: ref.read(routerRefreshProvider),
    redirect: (context, state) {
      final location = state.matchedLocation;

      final authState = ref.read(authStateProvider);
      final authGuard = ref.read(authGuardProvider);
      final introCompleted = ref.read(introStatusProvider);

      if (location == AppRoutes.splash || authState.isLoading) return null;

      if (!introCompleted && location != AppRoutes.intro) {
        return AppRoutes.intro;
      }

      final isAuth = authGuard;
      final isOnPublicRoute =
          location == AppRoutes.landing ||
          location == AppRoutes.intro ||
          location == AppRoutes.login;

      if (!isAuth && !isOnPublicRoute) {
        return AppRoutes.login;
      }

      if (isAuth &&
          (location == AppRoutes.login || location == AppRoutes.intro)) {
        final user = authState.hasValue ? authState.value : null;
        return user != null && user.isCompanion
            ? AppRoutes.companionHome
            : AppRoutes.home;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.landing,
        name: 'landing',
        builder: (context, state) => const LandingScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.intro,
        name: 'intro',
        builder: (context, state) => const IntroScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            AppShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.home,
                name: 'home',
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.services,
                name: 'services',
                builder: (context, state) => const ServicesScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.requests,
                name: 'requests',
                builder: (context, state) => const MyRequestsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.profile,
                name: 'profile',
                builder: (context, state) => const SettingsScreen(),
                routes: [
                  GoRoute(
                    path: 'details',
                    name: 'profileDetails',
                    builder: (context, state) => const ProfileScreen(),
                  ),
                  GoRoute(
                    path: 'notifications',
                    name: 'profileNotifications',
                    builder: (context, state) => const NotificationsScreen(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      ShellRoute(
        builder: (context, state, child) => CompanionShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.companionHome,
            name: 'companionHome',
            builder: (context, state) => const HomeTab(),
          ),
          GoRoute(
            path: AppRoutes.companionRequests,
            name: 'companionRequests',
            builder: (context, state) => const CompanionRequestsTab(),
          ),
          GoRoute(
            path: AppRoutes.companionCalendar,
            name: 'companionCalendar',
            builder: (context, state) => const CalendarTab(),
          ),
          GoRoute(
            path: AppRoutes.companionEarnings,
            name: 'companionEarnings',
            builder: (context, state) => const EarningsTab(),
          ),
        ],
      ),
    ],
  );
}
