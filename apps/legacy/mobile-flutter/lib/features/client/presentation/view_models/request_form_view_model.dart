import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../domain/entities/service_request.dart';

part 'request_form_view_model.g.dart';

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
  final String phone;
  final String address;
  final String? meetingPoint;
  final String? preferredDate;
  final String notes;

  const RequestFormData({
    this.serviceType = '',
    this.fullName = '',
    this.phone = '',
    this.address = '',
    this.meetingPoint,
    this.preferredDate,
    this.notes = '',
  });

  RequestFormData copyWith({
    String? serviceType,
    String? fullName,
    String? phone,
    String? address,
    String? meetingPoint,
    String? preferredDate,
    String? notes,
  }) {
    return RequestFormData(
      serviceType: serviceType ?? this.serviceType,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      address: address ?? this.address,
      meetingPoint: meetingPoint ?? this.meetingPoint,
      preferredDate: preferredDate ?? this.preferredDate,
      notes: notes ?? this.notes,
    );
  }
}

@riverpod
class RequestFormDataState extends _$RequestFormDataState {
  @override
  RequestFormData build() => const RequestFormData();

  void updateServiceType(String v) => state = state.copyWith(serviceType: v);

  void updateFullName(String v) => state = state.copyWith(fullName: v);

  void updatePhone(String v) => state = state.copyWith(phone: v);

  void updateAddress(String v) => state = state.copyWith(address: v);

  void updateMeetingPoint(String v) => state = state.copyWith(meetingPoint: v);

  void updatePreferredDate(String v) =>
      state = state.copyWith(preferredDate: v);

  void updateNotes(String v) => state = state.copyWith(notes: v);
}

@riverpod
class RequestSubmission extends _$RequestSubmission {
  @override
  AsyncValue<ServiceRequest?> build() => const AsyncValue.data(null);

  Future<void> submit(RequestFormData data) async {
    state = const AsyncValue.loading();
    try {
      final repo = ref.read(requestRepositoryProvider);
      final request = await repo.createRequest(
        serviceType: data.serviceType,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        meetingPoint: data.meetingPoint,
        preferredDate: data.preferredDate,
        notes: data.notes.isEmpty ? null : data.notes,
      );
      state = AsyncValue.data(request);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  void reset() => state = const AsyncValue.data(null);
}
