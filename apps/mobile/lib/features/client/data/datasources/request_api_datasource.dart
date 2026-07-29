import 'dart:async';

import '../../domain/entities/service_request.dart';
import '../../domain/entities/request_status.dart';

class RequestApiDatasource {
  final _dio = DIO(); // TODO: Setup Dio client

  Future<ServiceRequest> createRequest(ServiceRequest request) async {
    // TODO: Implement real HTTP call to backend endpoint
    // final response = await _dio.post('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}', data: {...});
    // return _fromJson(response.data['data']);
    
    // For now, return mock response
    await Future.delayed(const Duration(seconds: 1));
    return ServiceRequest(
      id: 'REQ-\${DateTime.now().millisecondsSinceEpoch}',
      clientId: request.clientId,
      companionId: request.companionId,
      serviceType: request.serviceType,
      fullName: request.fullName,
      phone: request.phone,
      address: request.address,
      meetingPoint: request.meetingPoint,
      preferredDate: request.preferredDate,
      notes: request.notes,
      status: RequestStatus.pending,
      createdAt: DateTime.now(),
    );
  }

  Future<List<ServiceRequest>> getMyRequests() async {
    // TODO: Implement real HTTP call to GET /api/v1/requests
    // final response = await _dio.get('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}');
    // return (response.data['data'] as List).map((e) => _fromJson(e)).toList();
    
    await Future.delayed(const Duration(milliseconds: 500));
    return [];
  }

  Future<List<ServiceRequest>> getCompanionRequests() async {
    // TODO: Implement real HTTP call to GET /api/v1/requests?role=companion
    // final response = await _dio.get('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}', queryParameters: {'role': 'companion'});
    // return (response.data['data'] as List).map((e) => _fromJson(e)).toList();
    
    await Future.delayed(const Duration(milliseconds: 500));
    return [];
  }

  Future<ServiceRequest> acceptRequest(String requestId) async {
    // TODO: Implement real HTTP call to POST /api/v1/requests/:id/accept
    // final response = await _dio.post('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}/$requestId/accept');
    // return _fromJson(response.data['data']);
    
    await Future.delayed(const Duration(milliseconds: 300));
    return ServiceRequest(
      id: requestId,
      clientId: 'client-123',
      companionId: 'companion-456',
      serviceType: 'accompaniment',
      fullName: 'Juan Pérez',
      phone: '+56912345678',
      address: 'Av. Providencia 1234',
      status: RequestStatus.accepted,
      createdAt: DateTime.now(),
    );
  }

  Future<ServiceRequest> rejectRequest(String requestId) async {
    // TODO: Implement real HTTP call to POST /api/v1/requests/:id/reject
    // final response = await _dio.post('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}/$requestId/reject');
    // return _fromJson(response.data['data']);
    
    await Future.delayed(const Duration(milliseconds: 300));
    return ServiceRequest(
      id: requestId,
      clientId: 'client-123',
      companionId: 'companion-456',
      serviceType: 'accompaniment',
      fullName: 'Juan Pérez',
      phone: '+56912345678',
      address: 'Av. Providencia 1234',
      status: RequestStatus.rejected,
      createdAt: DateTime.now(),
    );
  }

  Future<bool> checkId(String idNumber) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return !idNumber.startsWith('99');
  }

  ServiceRequest _fromJson(Map<String, dynamic> json) {
    return ServiceRequest(
      id: json['id'] as String,
      clientId: json['client_id'] as String,
      companionId: json['companion_id'] as String,
      serviceType: json['service_type'] as String,
      fullName: json['full_name'] as String,
      phone: json['phone'] as String,
      address: json['address'] as String?,
      meetingPoint: json['meeting_point'] != null
          ? MeetingPoint(name: json['meeting_point'] as String)
          : null,
      preferredDate: json['preferred_date'] as String?,
      notes: json['notes'] as String?,
      status: _parseStatus(json['status'] as String),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }

  RequestStatus _parseStatus(String status) {
    switch (status) {
      case 'pending': return RequestStatus.pending;
      case 'accepted': return RequestStatus.accepted;
      case 'rejected': return RequestStatus.rejected;
      case 'cancelled': return RequestStatus.cancelled;
      case 'completed': return RequestStatus.completed;
      default: return RequestStatus.pending;
    }
  }
}

// TODO: Setup Dio client
class DIO {
  Future<Map<String, dynamic>> post(String url, {Map<String, dynamic>? data}) async {
    print('POST $url with data: $data');
    return {
      'id': 'req_${DateTime.now().millisecondsSinceEpoch}',
      'client_id': 'client-123',
      'companion_id': 'companion-456',
      'service_type': 'accompaniment',
      'full_name': 'Juan Pérez',
      'phone': '+56912345678',
      'address': 'Av. Providencia 1234',
      'status': 'pending',
      'created_at': DateTime.now().toIso8601String(),
    };
  }

  Future<Map<String, dynamic>> get(String url, {Map<String, dynamic>? queryParameters}) async {
    print('GET $url with query: $queryParameters');
    return {
      'data': [],
      'count': 0,
    };
  }
}
