import 'package:clerk_auth/clerk_auth.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../../../core/router/guards.dart';
import '../../../client/domain/entities/service_request.dart';
import '../../domain/entities/user.dart';
import 'auth_view_model.dart';

part 'register_view_model.g.dart';

@riverpod
class RegisterStep extends _$RegisterStep {
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

class RegisterFormData {
  final String fullName;
  final String email;
  final String phone;
  final String password;
  final String serviceType;
  final String address;
  final String? meetingPoint;
  final String? preferredDate;
  final String notes;
  final String? companionId;

  const RegisterFormData({
    this.fullName = '',
    this.email = '',
    this.phone = '',
    this.password = '',
    this.serviceType = '',
    this.address = '',
    this.meetingPoint,
    this.preferredDate,
    this.notes = '',
    this.companionId,
  });

  RegisterFormData copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? password,
    String? serviceType,
    String? address,
    String? meetingPoint,
    String? preferredDate,
    String? notes,
    String? companionId,
  }) {
    return RegisterFormData(
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      password: password ?? this.password,
      serviceType: serviceType ?? this.serviceType,
      address: address ?? this.address,
      meetingPoint: meetingPoint ?? this.meetingPoint,
      preferredDate: preferredDate ?? this.preferredDate,
      notes: notes ?? this.notes,
      companionId: companionId ?? this.companionId,
    );
  }
}

@riverpod
class RegisterFormDataState extends _$RegisterFormDataState {
  @override
  RegisterFormData build() => const RegisterFormData();

  void updateFullName(String v) => state = state.copyWith(fullName: v);

  void updateEmail(String v) => state = state.copyWith(email: v);

  void updatePhone(String v) => state = state.copyWith(phone: v);

  void updatePassword(String v) => state = state.copyWith(password: v);

  void updateServiceType(String v) => state = state.copyWith(serviceType: v);

  void updateAddress(String v) => state = state.copyWith(address: v);

  void updateMeetingPoint(String v) => state = state.copyWith(meetingPoint: v);

  void updatePreferredDate(String v) => state = state.copyWith(preferredDate: v);

  void updateNotes(String v) => state = state.copyWith(notes: v);

  void updateCompanionId(String v) => state = state.copyWith(companionId: v);
}

@riverpod
class RegisterSubmission extends _$RegisterSubmission {
  @override
  AsyncValue<ServiceRequest?> build() => const AsyncValue.data(null);

  Future<void> submit(RegisterFormData data) async {
    state = const AsyncValue.loading();
    try {
      final user = await ref.read(authRepositoryProvider).signUp(
            firstName: _firstName(data.fullName),
            lastName: _lastName(data.fullName),
            email: data.email.trim(),
            password: data.password,
            role: UserRole.client,
          );

      if (user == null) {
        throw const RegisterSubmissionException('No pudimos crear tu cuenta. Intenta de nuevo.');
      }

      final request = await ref.read(requestRepositoryProvider).createRequest(
            serviceType: data.serviceType,
            fullName: data.fullName,
            phone: data.phone,
            companionId: data.companionId,
            address: data.address.isEmpty ? null : data.address,
            meetingPoint: data.meetingPoint,
            preferredDate: data.preferredDate,
            notes: data.notes.isEmpty ? null : data.notes,
          );

      ref.read(authGuardProvider.notifier).authenticate();
      ref.invalidate(authStateProvider);

      state = AsyncValue.data(request);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void reset() => state = const AsyncValue.data(null);

  String _firstName(String fullName) {
    final parts = fullName.trim().split(RegExp(r'\s+'));
    return parts.isEmpty ? '' : parts.first;
  }

  String _lastName(String fullName) {
    final parts = fullName.trim().split(RegExp(r'\s+'));
    if (parts.length <= 1) return '';
    return parts.sublist(1).join(' ');
  }
}

class RegisterSubmissionException implements Exception {
  const RegisterSubmissionException(this.message);

  final String message;

  @override
  String toString() => message;
}

String registerErrorMessage(Object error) {
  if (error is RegisterSubmissionException) return error.message;
  if (error is ClerkError) {
    final detail = error.argument ?? error.errors?.errorMessage ?? '';
    final lower = detail.toLowerCase();
    if (lower.contains('taken') || lower.contains('exists') || lower.contains('registrado')) {
      return 'Ya existe una cuenta con ese correo.';
    }
    if (lower.contains('password')) {
      return 'La contraseña no es válida.';
    }
  }
  return 'No pudimos crear tu cuenta. Revisa tus datos e intenta de nuevo.';
}
