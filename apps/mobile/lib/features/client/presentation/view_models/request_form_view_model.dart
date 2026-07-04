import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../domain/entities/service_request.dart';
import '../../domain/entities/request_status.dart';
import '../../domain/repositories/request_repository.dart';
import '../../data/repositories/request_repository_impl.dart';
import '../../data/datasources/request_api_datasource.dart';

part 'request_form_view_model.g.dart';

@riverpod
RequestRepository requestRepository(Ref ref) {
  return RequestRepositoryImpl(RequestApiDatasource());
}

@riverpod
class RequestFormStep extends _$RequestFormStep {
  @override
  int build() => 0;

  void next() {
    if (state < 3) state++;
  }

  void previous() {
    if (state > 0) state--;
  }

  void goTo(int step) {
    state = step;
  }
}

class RequestFormData {
  final String serviceType;
  final String fullName;
  final String idNumber;
  final String phone;
  final String address;
  final DateTime? preferredDate;
  final String notes;

  const RequestFormData({
    this.serviceType = '',
    this.fullName = '',
    this.idNumber = '',
    this.phone = '',
    this.address = '',
    this.preferredDate,
    this.notes = '',
  });

  RequestFormData copyWith({
    String? serviceType,
    String? fullName,
    String? idNumber,
    String? phone,
    String? address,
    DateTime? preferredDate,
    String? notes,
  }) {
    return RequestFormData(
      serviceType: serviceType ?? this.serviceType,
      fullName: fullName ?? this.fullName,
      idNumber: idNumber ?? this.idNumber,
      phone: phone ?? this.phone,
      address: address ?? this.address,
      preferredDate: preferredDate ?? this.preferredDate,
      notes: notes ?? this.notes,
    );
  }
}

@riverpod
class RequestFormDataState extends _$RequestFormDataState {
  @override
  RequestFormData build() => const RequestFormData();

  void updateServiceType(String v) =>
      state = state.copyWith(serviceType: v);

  void updateFullName(String v) =>
      state = state.copyWith(fullName: v);

  void updateIdNumber(String v) =>
      state = state.copyWith(idNumber: v);

  void updatePhone(String v) =>
      state = state.copyWith(phone: v);

  void updateAddress(String v) =>
      state = state.copyWith(address: v);

  void updatePreferredDate(DateTime v) =>
      state = state.copyWith(preferredDate: v);

  void updateNotes(String v) =>
      state = state.copyWith(notes: v);
}

@riverpod
class RequestSubmission extends _$RequestSubmission {
  @override
  AsyncValue<ServiceRequest?> build() => const AsyncValue.data(null);

  Future<void> submit(RequestFormData data) async {
    state = const AsyncValue.loading();
    try {
      final repo = ref.read(requestRepositoryProvider);
      final request = await repo.createRequest(ServiceRequest(
        id: '',
        serviceType: data.serviceType,
        fullName: data.fullName,
        idNumber: data.idNumber,
        phone: data.phone,
        address: data.address,
        preferredDate: data.preferredDate,
        notes: data.notes,
        status: RequestStatus.pending,
        createdAt: DateTime.now(),
      ));
      state = AsyncValue.data(request);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  void reset() => state = const AsyncValue.data(null);
}
