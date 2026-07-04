import 'package:flutter/material.dart';

class ContigoBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const ContigoBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
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
            icon: Icon(Icons.account_balance_wallet), label: 'Ganancias'),
      ],
    );
  }
}
