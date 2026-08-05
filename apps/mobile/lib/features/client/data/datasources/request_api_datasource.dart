import 'package:dio/dio.dart';

import '../../../../core/network/api_endpoints.dart';
import '../../domain/entities/service_request.dart';
import '../../domain/entities/request_status.dart';

class RequestApiDatasource {
  final Dio _dio;

  RequestApiDatasource(this._dio);

  Future<ServiceRequest> createRequest({
    required String serviceType,
    required String fullName,
    required String phone,
    String? address,
    String? meetingPoint,
    String? preferredDate,
    String? notes,
  }) async {
    final body = <String, dynamic>{
      'service_type': serviceType,
      'full_name': fullName,
      'phone': phone,
      'address': ?address,
      'meeting_point': ?meetingPoint,
      'preferred_date': ?preferredDate,
      'notes': ?notes,
    };
    final response = await _dio.post(ApiEndpoints.requests, data: body);
    return _fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<List<ServiceRequest>> getMyRequests() async {
    final response = await _dio.get(
      ApiEndpoints.requests,
      queryParameters: {'role': 'client'},
    );
    final list = response.data['data'] as List;
    return list.map((e) => _fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<ServiceRequest>> getPendingRequests() async {
    final response = await _dio.get(
      ApiEndpoints.requests,
      queryParameters: {'role': 'pending'},
    );
    final list = response.data['data'] as List;
    return list.map((e) => _fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<ServiceRequest>> getCompanionRequests() async {
    final response = await _dio.get(
      ApiEndpoints.requests,
      queryParameters: {'role': 'companion'},
    );
    final list = response.data['data'] as List;
    return list.map((e) => _fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<ServiceRequest> acceptRequest(String requestId) async {
    final response = await _dio.post(
      '${ApiEndpoints.requests}/$requestId/accept',
    );
    return _fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<ServiceRequest> rejectRequest(String requestId) async {
    final response = await _dio.post(
      '${ApiEndpoints.requests}/$requestId/reject',
    );
    return _fromJson(response.data['data'] as Map<String, dynamic>);
  }

  ServiceRequest _fromJson(Map<String, dynamic> json) {
    return ServiceRequest(
      id: json['id'] as String,
      clientId: json['client_id'] as String? ?? '',
      companionId: json['companion_id'] as String?,
      serviceType: json['service_type'] as String,
      fullName: json['full_name'] as String,
      phone: json['phone'] as String? ?? '',
      address: json['address'] as String?,
      meetingPoint: json['meeting_point'] as String?,
      preferredDate: json['preferred_date'] as String? ?? '',
      notes: json['notes'] as String?,
      status: _parseStatus(json['status'] as String? ?? 'pending'),
      createdAt: _parseDateTime(json['created_at']),
      updatedAt: json['updated_at'] != null
          ? _parseDateTime(json['updated_at'])
          : null,
    );
  }

  DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is String) return DateTime.parse(value);
    return DateTime.now();
  }

  RequestStatus _parseStatus(String status) {
    switch (status) {
      case 'pending':
        return RequestStatus.pending;
      case 'accepted':
        return RequestStatus.accepted;
      case 'rejected':
        return RequestStatus.rejected;
      case 'cancelled':
        return RequestStatus.cancelled;
      case 'completed':
        return RequestStatus.completed;
      default:
        return RequestStatus.pending;
    }
  }
}
