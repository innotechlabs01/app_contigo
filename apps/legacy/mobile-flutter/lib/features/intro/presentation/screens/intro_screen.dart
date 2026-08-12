import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';
import '../../../../shared/widgets/contigo_page_indicator.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../domain/entities/intro_page_data.dart';
import '../widgets/intro_page_widget.dart';
import '../view_models/intro_view_model.dart';

class IntroScreen extends ConsumerStatefulWidget {
  const IntroScreen({super.key});

  @override
  ConsumerState<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends ConsumerState<IntroScreen> {
  late final PageController _controller;

  @override
  void initState() {
    super.initState();
    _controller = PageController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final spacing = context.contigoSpacing;
    final currentPage = ref.watch(introViewModelProvider);
    final viewModel = ref.read(introViewModelProvider.notifier);

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.only(right: spacing.md, top: spacing.sm),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (!viewModel.isLastPage)
                    TextButton(
                      onPressed: () async {
                        await viewModel.skipIntro();
                        if (context.mounted) context.go(AppRoutes.login);
                      },
                      style: TextButton.styleFrom(
                        foregroundColor: colors.secondary,
                      ),
                      child: const Text('Saltar'),
                    ),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
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
              padding: EdgeInsets.all(spacing.lg),
              child: Column(
                children: [
                  ContigoPageIndicator(
                    currentPage: currentPage,
                    count: IntroPageData.pages.length,
                  ),
                  SizedBox(height: spacing.lg),
                  ContigoButton(
                    variant: ContigoButtonVariant.primary,
                    label: viewModel.isLastPage ? 'Comenzar' : 'Siguiente',
                    onPressed: () async {
                      if (viewModel.isLastPage) {
                        await viewModel.completeIntro();
                        if (context.mounted) context.go(AppRoutes.login);
                      } else {
                        _controller.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      }
                    },
                    height: 56,
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
