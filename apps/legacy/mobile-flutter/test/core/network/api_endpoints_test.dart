import 'package:flutter_test/flutter_test.dart';
import 'package:contigo_mobile/core/network/api_endpoints.dart';

void main() {
  group('ApiEndpoints', () {
    test('should have valid base URL', () {
      expect(ApiEndpoints.baseUrl, 'https://contigo.app/api');
    });

    test('requests endpoint should be correct', () {
      expect(ApiEndpoints.requests, '/requests');
    });
  });
}
