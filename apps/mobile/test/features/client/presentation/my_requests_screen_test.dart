import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:contigo_mobile/features/client/presentation/screens/my_requests_screen.dart';
import 'package:contigo_mobile/features/client/domain/entities/service_request.dart';
import 'package:contigo_mobile/features/client/domain/entities/request_status.dart';
import 'package:contigo_mobile/features/client/presentation/view_models/my_requests_view_model.dart';

void main() {
  testWidgets('shows empty state when no requests', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: MyRequestsScreen())),
    );
    await tester.pumpAndSettle();

    expect(find.text('No tienes solicitudes aún'), findsOneWidget);
    expect(find.text('Mis Solicitudes'), findsOneWidget);
  });

  testWidgets('shows filter icon in app bar', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: MyRequestsScreen())),
    );
    await tester.pumpAndSettle();

    expect(find.byIcon(Icons.filter_list), findsOneWidget);
  });

  testWidgets('shows loading indicator while fetching', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: MyRequestsScreen())),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    await tester.pumpAndSettle();
  });

  testWidgets('shows request cards when data available', (tester) async {
    final testRequests = [
      ServiceRequest(
        id: 'REQ-001',
        serviceType: 'Acompañamiento Médico',
        fullName: 'Test User',
        idNumber: '12345678',
        status: RequestStatus.pending,
        createdAt: DateTime(2025, 6, 15),
      ),
    ];

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          myRequestsListProvider.overrideWith(
            (ref) => Future.value(testRequests),
          ),
        ],
        child: const MaterialApp(home: MyRequestsScreen()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Acompañamiento Médico'), findsOneWidget);
    expect(find.text('ID: REQ-001'), findsOneWidget);
  });

  testWidgets('shows filtered empty state with clear action', (tester) async {
    final testRequests = [
      ServiceRequest(
        id: 'REQ-001',
        serviceType: 'Acompañamiento Médico',
        fullName: 'Test User',
        idNumber: '12345678',
        status: RequestStatus.pending,
        createdAt: DateTime(2025, 6, 15),
      ),
    ];

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          myRequestsListProvider.overrideWith(
            (ref) => Future.value(testRequests),
          ),
          myRequestsFilterProvider.overrideWithValue('approved'),
        ],
        child: const MaterialApp(home: MyRequestsScreen()),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('No hay solicitudes con este filtro'), findsOneWidget);
    expect(find.text('Limpiar filtro'), findsOneWidget);
  });
}
