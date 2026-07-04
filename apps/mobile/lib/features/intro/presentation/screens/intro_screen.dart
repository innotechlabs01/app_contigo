import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../shared/widgets/contigo_page_indicator.dart';
import '../../domain/entities/intro_page_data.dart';
import '../widgets/intro_page_widget.dart';
import '../view_models/intro_view_model.dart';

class IntroScreen extends ConsumerWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentPage = ref.watch(introViewModelProvider);
    final viewModel = ref.read(introViewModelProvider.notifier);
    final controller = PageController();

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 16, top: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (!viewModel.isLastPage)
                    TextButton(
                      onPressed: () async {
                        await viewModel.skipIntro();
                        if (context.mounted) context.go('/');
                      },
                      child: const Text('Saltar'),
                    ),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: controller,
                onPageChanged: (page) => viewModel.setPage(page),
                itemCount: IntroPageData.pages.length,
                itemBuilder: (context, index) => IntroPageWidget(
                  pageData: IntroPageData.pages[index],
                  isFirst: index == 0,
                  isLast: index == IntroPageData.pages.length - 1,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  ContigoPageIndicator(
                    currentPage: currentPage,
                    count: IntroPageData.pages.length,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () async {
                        if (viewModel.isLastPage) {
                          await viewModel.completeIntro();
                          if (context.mounted) context.go('/');
                        } else {
                          controller.nextPage(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF00668A),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(56),
                        ),
                        textStyle: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      child: Text(viewModel.isLastPage ? 'Comenzar' : 'Siguiente'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
