import 'dart:math';

import '../../domain/entities/service_request.dart';
import '../../domain/entities/request_status.dart';

class RequestApiDatasource {
  Future<ServiceRequest> createRequest(ServiceRequest request) async {
    await Future.delayed(const Duration(seconds: 1));
    return ServiceRequest(
      id: 'REQ-${Random().nextInt(99999)}',
      serviceType: request.serviceType,
      fullName: request.fullName,
      idNumber: request.idNumber,
      phone: request.phone,
      address: request.address,
      preferredDate: request.preferredDate,
      notes: request.notes,
      status: RequestStatus.pending,
      createdAt: DateTime.now(),
    );
  }

  Future<List<ServiceRequest>> getMyRequests() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return [];
  }

  Future<bool> checkId(String idNumber) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return !idNumber.startsWith('99');
  }
}
