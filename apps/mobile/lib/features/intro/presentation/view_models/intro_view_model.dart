import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/intro_page_data.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/router/guards.dart';

part 'intro_view_model.g.dart';

@riverpod
class IntroViewModel extends _$IntroViewModel {
  @override
  int build() => 0;

  int get totalPages => IntroPageData.pages.length;
  bool get isLastPage => state == totalPages - 1;
  bool get isFirstPage => state == 0;

  void setPage(int page) => state = page;

  void nextPage() {
    if (!isLastPage) state++;
  }

  Future<void> completeIntro() async {
    final prefs = ref.read(preferencesServiceProvider);
    await prefs.setBool('intro_completed', true);
    ref.read(introGuardProvider.notifier).complete();
  }

  Future<void> skipIntro() async {
    final prefs = ref.read(preferencesServiceProvider);
    await prefs.setBool('intro_completed', true);
    ref.read(introGuardProvider.notifier).complete();
  }
}
