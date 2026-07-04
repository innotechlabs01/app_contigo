import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

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
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list_alt),
            label: 'Requests',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month),
            label: 'Calendar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Earnings',
          ),
        ],
      ),
    );
  }

  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/companion/home')) return 0;
    if (location.startsWith('/companion/requests')) return 1;
    if (location.startsWith('/companion/calendar')) return 2;
    if (location.startsWith('/companion/earnings')) return 3;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        GoRouter.of(context).go('/companion/home');
        break;
      case 1:
        GoRouter.of(context).go('/companion/requests');
        break;
      case 2:
        GoRouter.of(context).go('/companion/calendar');
        break;
      case 3:
        GoRouter.of(context).go('/companion/earnings');
        break;
    }
  }
}
