import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:contigo_mobile/shared/widgets/contigo_stepper.dart';

void main() {
  group('ContigoStepper', () {
    testWidgets('renders correct number of steps', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStepper(
            currentStep: 0,
            totalSteps: 3,
            labels: const ['Step 1', 'Step 2', 'Step 3'],
          ),
        ),
      ));
      expect(find.text('Step 1'), findsOneWidget);
      expect(find.text('Step 2'), findsOneWidget);
      expect(find.text('Step 3'), findsOneWidget);
    });

    testWidgets('shows active step as current', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStepper(
            currentStep: 0,
            totalSteps: 3,
            labels: const ['Step 1', 'Step 2', 'Step 3'],
          ),
        ),
      ));
      // Step 1 should show "1" (current/active)
      expect(find.text('1'), findsOneWidget);
    });

    testWidgets('shows checkmark for completed steps', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStepper(
            currentStep: 2,
            totalSteps: 3,
            labels: const ['Step 1', 'Step 2', 'Step 3'],
          ),
        ),
      ));
      // Steps 0 and 1 are completed — they show Icons.check
      expect(find.byIcon(Icons.check), findsNWidgets(2));
    });

    testWidgets('shows filled circle for current step', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ContigoStepper(
            currentStep: 2,
            totalSteps: 3,
            labels: const ['Step 1', 'Step 2', 'Step 3'],
          ),
        ),
      ));
      // Step 2 (third step, index 2) is current — shows container with step number
      expect(find.text('3'), findsOneWidget);
    });
  });
}
