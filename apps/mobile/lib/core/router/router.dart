import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../features/client/presentation/screens/my_requests_screen.dart';
import '../../features/client/presentation/screens/request_form_screen.dart';
import '../../features/client/presentation/screens/services_screen.dart';
import '../../features/companion/presentation/screens/calendar_tab.dart';
import '../../features/companion/presentation/screens/companion_shell.dart';
import '../../features/companion/presentation/screens/earnings_tab.dart';
import '../../features/companion/presentation/screens/home_tab.dart';
import '../../features/companion/presentation/screens/requests_tab.dart';
import '../../features/intro/presentation/screens/intro_screen.dart';
import '../../features/landing/presentation/screens/landing_screen.dart';
import '../../features/settings/presentation/screens/notifications_screen.dart';
import '../../features/settings/presentation/screens/profile_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';
import 'guards.dart';
import 'routes.dart';

part 'router.g.dart';

@riverpod
GoRouter router(Ref ref) {
  final authGuard = ref.watch(authGuardProvider);

  return GoRouter(
    initialLocation: AppRoutes.landing,
    redirect: (context, state) {
      final isAuth = authGuard;
      final isOnAuthRoute = state.matchedLocation == AppRoutes.landing ||
          state.matchedLocation == AppRoutes.intro;

      if (!isAuth && !isOnAuthRoute) {
        return AppRoutes.landing;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.landing,
        name: 'landing',
        builder: (context, state) => const LandingScreen(),
      ),
      GoRoute(
        path: AppRoutes.intro,
        name: 'intro',
        builder: (context, state) => const IntroScreen(),
      ),
      GoRoute(
        path: AppRoutes.clientServices,
        name: 'clientServices',
        builder: (context, state) => const ServicesScreen(),
      ),
      GoRoute(
        path: AppRoutes.clientRequest,
        name: 'clientRequest',
        builder: (context, state) => const RequestFormScreen(),
      ),
      GoRoute(
        path: AppRoutes.clientRequests,
        name: 'clientRequests',
        builder: (context, state) => const MyRequestsScreen(),
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
      GoRoute(
        path: AppRoutes.settings,
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: AppRoutes.settingsProfile,
        name: 'settingsProfile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: AppRoutes.settingsNotifications,
        name: 'settingsNotifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
    ],
  );
}
