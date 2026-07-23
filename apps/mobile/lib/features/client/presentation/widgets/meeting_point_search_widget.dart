import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../core/di/providers.dart';
import '../../../../core/theme/extensions.dart';
import '../../data/datasources/google_places_datasource.dart';
import '../../data/repositories/places_repository_impl.dart';
import '../../domain/entities/meeting_point.dart';
import '../../domain/use_cases/search_meeting_points_use_case.dart';

part 'meeting_point_search_widget.g.dart';

@riverpod
SearchMeetingPointsUseCase searchMeetingPointsUseCase(Ref ref) {
  final dio = ref.watch(dioProvider);
  final datasource = GooglePlacesDatasource(dio);
  final repository = PlacesRepositoryImpl(datasource);
  return SearchMeetingPointsUseCase(repository);
}

class MeetingPointSearchWidget extends ConsumerStatefulWidget {
  final ValueChanged<MeetingPoint?> onMeetingPointSelected;

  const MeetingPointSearchWidget({
    super.key,
    required this.onMeetingPointSelected,
  });

  @override
  ConsumerState<MeetingPointSearchWidget> createState() =>
      _MeetingPointSearchWidgetState();
}

class _MeetingPointSearchWidgetState
    extends ConsumerState<MeetingPointSearchWidget> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  final _layerLink = LayerLink();

  List<MeetingPoint> _suggestions = [];
  OverlayEntry? _overlayEntry;
  bool _isLoading = false;
  bool _hasSelection = false;
  Timer? _debounce;

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    _focusNode.dispose();
    _removeOverlay();
    super.dispose();
  }

  void _onChanged(String query) {
    _debounce?.cancel();
    if (query.trim().length < 3 || _hasSelection) {
      _removeOverlay();
      setState(() {
        _suggestions = [];
        _isLoading = false;
      });
      return;
    }

    setState(() => _isLoading = true);

    _debounce = Timer(const Duration(milliseconds: 300), () async {
      try {
        final results = await ref.read(searchMeetingPointsUseCaseProvider)(query);
        if (mounted) {
          setState(() {
            _suggestions = results;
            _isLoading = false;
          });
          _showOverlay();
        }
      } catch (e) {
        debugPrint('MeetingPoint search error: $e');
        if (mounted) {
          setState(() {
            _suggestions = [];
            _isLoading = false;
          });
          _removeOverlay();
        }
      }
    });
  }

  void _onSuggestionSelected(MeetingPoint suggestion) async {
    _debounce?.cancel();
    _removeOverlay();
    _focusNode.unfocus();

    setState(() => _isLoading = true);

    try {
      final details = await ref.read(searchMeetingPointsUseCaseProvider).getDetails(
        suggestion.placeId ?? '',
        suggestion.address,
      );
      if (mounted) {
        setState(() {
          _controller.text = details.address;
          _hasSelection = true;
          _isLoading = false;
        });
        widget.onMeetingPointSelected(details);
      }
    } catch (e) {
      debugPrint('MeetingPoint details error: $e');
      if (mounted) {
        setState(() {
          _hasSelection = false;
          _isLoading = false;
        });
      }
    }
  }

  void _onClear() {
    _debounce?.cancel();
    _controller.clear();
    _removeOverlay();
    setState(() {
      _suggestions = [];
      _hasSelection = false;
      _isLoading = false;
    });
    widget.onMeetingPointSelected(null);
  }

  void _showOverlay() {
    _removeOverlay();
    if (_suggestions.isEmpty) return;

    final overlay = Overlay.of(context);
    final renderBox = context.findRenderObject() as RenderBox;
    final size = renderBox.size;

    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        width: size.width,
        child: CompositedTransformFollower(
          link: _layerLink,
          showWhenUnlinked: false,
          offset: Offset(0, size.height + 4),
          child: Material(
            elevation: 4,
            borderRadius: BorderRadius.circular(context.contigoRadius.lg),
            color: context.contigoColors.surfaceContainerLowest,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 250),
              child: ListView.separated(
                padding: EdgeInsets.zero,
                shrinkWrap: true,
                itemCount: _suggestions.length,
                separatorBuilder: (_, _) => Divider(
                  height: 1,
                  color: context.contigoColors.outlineVariant
                      .withValues(alpha: 0.5),
                ),
                itemBuilder: (context, index) {
                  final suggestion = _suggestions[index];
                  return _SuggestionTile(
                    suggestion: suggestion,
                    onTap: () => _onSuggestionSelected(suggestion),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );

    overlay.insert(_overlayEntry!);
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final spacing = context.contigoSpacing;
    final radius = context.contigoRadius;

    return CompositedTransformTarget(
      link: _layerLink,
      child: TextFormField(
        controller: _controller,
        focusNode: _focusNode,
        onChanged: _onChanged,
        style: typography.bodyMedium.copyWith(color: colors.onSurface),
        cursorColor: colors.primary,
        decoration: InputDecoration(
          hintText: 'Ej. Cafeteria del Parque Central',
          hintStyle: typography.bodyMedium.copyWith(
            color: colors.onSurfaceVariant.withValues(alpha: 0.5),
          ),
          filled: true,
          fillColor: colors.surfaceContainer,
          contentPadding: EdgeInsets.symmetric(
            horizontal: spacing.md,
            vertical: spacing.md,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(radius.lg),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(radius.lg),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(radius.lg),
            borderSide: BorderSide(color: colors.primary, width: 2),
          ),
          prefixIcon: Icon(
            Icons.location_on,
            color: colors.onSurfaceVariant,
            size: 20,
          ),
          suffixIcon: _buildSuffixIcon(colors),
        ),
      ),
    );
  }

  Widget? _buildSuffixIcon(ContigoColors colors) {
    if (_isLoading) {
      return const Padding(
        padding: EdgeInsets.all(12),
        child: SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      );
    }
    if (_hasSelection || _controller.text.isNotEmpty) {
      return IconButton(
        icon: Icon(Icons.clear, color: colors.onSurfaceVariant, size: 20),
        onPressed: _onClear,
      );
    }
    return null;
  }
}

class _SuggestionTile extends StatelessWidget {
  final MeetingPoint suggestion;
  final VoidCallback onTap;

  const _SuggestionTile({required this.suggestion, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final typography = context.contigoTypography;
    final spacing = context.contigoSpacing;

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: spacing.md,
          vertical: spacing.md,
        ),
        child: Row(
          children: [
            Icon(Icons.location_on, size: 16, color: colors.onSurfaceVariant),
            SizedBox(width: spacing.sm),
            Expanded(
              child: Text(
                suggestion.address,
                style: typography.bodyMedium.copyWith(
                  color: colors.onSurface,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
