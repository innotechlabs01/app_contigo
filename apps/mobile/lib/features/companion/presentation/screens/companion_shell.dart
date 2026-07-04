import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/routes.dart';

class CompanionShell extends StatelessWidget {
  final Widget child;

  const CompanionShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _calculateSelectedIndex(context),
        onTap: (index) => _onItemTapped(index, context),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF00668A),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),
          BottomNavigationBarItem(
              icon: Icon(Icons.list_alt), label: 'Solicitudes'),
          BottomNavigationBarItem(
              icon: Icon(Icons.calendar_month), label: 'Calendario'),
          BottomNavigationBarItem(
              icon: Icon(Icons.account_balance_wallet),
              label: 'Ganancias'),
        ],
      ),
    );
  }

  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith(AppRoutes.companionHome)) return 0;
    if (location.startsWith(AppRoutes.companionRequests)) return 1;
    if (location.startsWith(AppRoutes.companionCalendar)) return 2;
    if (location.startsWith(AppRoutes.companionEarnings)) return 3;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go(AppRoutes.companionHome);
      case 1:
        context.go(AppRoutes.companionRequests);
      case 2:
        context.go(AppRoutes.companionCalendar);
      case 3:
        context.go(AppRoutes.companionEarnings);
    }
  }
}
