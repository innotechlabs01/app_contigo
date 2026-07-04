import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/features/client/domain/entities/service_request.dart';
import 'package:contigo_mobile/features/client/domain/entities/request_status.dart';

void main() {
  group('ServiceRequest', () {
    test('can be created with required fields', () {
      final now = DateTime.now();
      final request = ServiceRequest(
        id: 'REQ-001',
        serviceType: 'medical',
        fullName: 'Test User',
        idNumber: '12345678',
        createdAt: now,
      );
      expect(request.id, 'REQ-001');
      expect(request.status, RequestStatus.pending);
    });
  });
}
