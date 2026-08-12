import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:contigo_mobile/features/auth/domain/entities/user.dart';
import 'package:contigo_mobile/features/auth/domain/repositories/auth_repository.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  group('User', () {
    test('can be created with required fields', () {
      final user = User(
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: UserRole.client,
      );
      expect(user.id, '1');
      expect(user.email, 'test@test.com');
      expect(user.name, 'Test User');
      expect(user.role, UserRole.client);
    });

    test('isClient returns true for client role', () {
      final user = User(
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: UserRole.client,
      );
      expect(user.isClient, isTrue);
      expect(user.isCompanion, isFalse);
      expect(user.isAdmin, isFalse);
    });

    test('isCompanion returns true for companion role', () {
      final user = User(
        id: '1',
        email: 'companion@test.com',
        name: 'Test Companion',
        role: UserRole.companion,
      );
      expect(user.isCompanion, isTrue);
      expect(user.isClient, isFalse);
      expect(user.isAdmin, isFalse);
    });
  });

  group('AuthRepository', () {
    late MockAuthRepository repository;

    setUp(() {
      repository = MockAuthRepository();
    });

    test('getSession returns user when authenticated', () async {
      when(() => repository.getSession()).thenAnswer(
        (_) async => User(
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: UserRole.client,
        ),
      );
      final user = await repository.getSession();
      expect(user, isNotNull);
      expect(user!.email, 'test@test.com');
    });

    test('getSession returns null when not authenticated', () async {
      when(() => repository.getSession()).thenAnswer((_) async => null);
      final user = await repository.getSession();
      expect(user, isNull);
    });

    test('signOut calls repository method', () async {
      when(() => repository.signOut()).thenAnswer((_) async {});
      await repository.signOut();
      verify(() => repository.signOut()).called(1);
    });
  });
}
