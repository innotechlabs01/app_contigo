import 'package:dio/dio.dart';

import '../../../../core/network/api_endpoints.dart';
import '../../domain/entities/companion.dart';

class CompanionApiDatasource {
  final Dio _dio;

  CompanionApiDatasource(this._dio);

  Future<List<Companion>> getCompanions() async {
    final response = await _dio.get(ApiEndpoints.companions);
    final list = response.data['data'] as List;
    return list.map((e) => _fromJson(e as Map<String, dynamic>)).toList();
  }

  Companion _fromJson(Map<String, dynamic> json) {
    return Companion(
      id: json['id'] as String,
      email: json['email'] as String? ?? '',
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      phone: json['phone'] as String?,
      avatar: json['avatar'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      experienceYears: (json['experience_years'] as num?)?.toInt() ?? 0,
      languages: _stringList(json['languages']),
      services: _stringList(json['services']),
      bio: json['bio'] as String?,
    );
  }

  List<String> _stringList(dynamic value) {
    if (value is! List) return const [];
    return value.whereType<String>().toList();
  }
}
