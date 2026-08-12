import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/features/client/domain/entities/service_type.dart';

void main() {
  group('ServiceType', () {
    test('has mock services', () {
      expect(ServiceType.mockServices.length, 3);
    });

    test('medical service has correct name', () {
      final medical = ServiceType.mockServices[0];
      expect(medical.name, 'Acompañamiento Médico');
    });
  });
}
