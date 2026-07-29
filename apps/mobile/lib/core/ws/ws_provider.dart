import 'dart:async';
import 'dart:convert';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../../features/auth/presentation/view_models/auth_view_model.dart';
import 'ws_event.dart';

part 'ws_provider.g.dart';

@riverpod
class WebSocketConnection extends _$WebSocketConnection {
  WebSocketChannel? _channel;
  StreamSubscription? _subscription;
  final _eventController = StreamController<WsEvent>.broadcast();
  Timer? _reconnectTimer;

  Stream<WsEvent> get events => _eventController.stream;

  @override
  AsyncValue<void> build() {
    ref.onDispose(() {
      _subscription?.cancel();
      _channel?.sink.close();
      _reconnectTimer?.cancel();
      _eventController.close();
    });

    final authState = ref.watch(authStateProvider);
    if (authState.valueOrNull != null) {
      _connect(authState.requireValue.token);
    }

    return const AsyncValue.data(null);
  }

  void _connect(String token) {
    _channel?.sink.close();
    final uri = Uri.parse('ws://localhost:8080/api/v1/ws?token=' + token);
    _channel = WebSocketChannel.connect(uri);
    _subscription = _channel!.stream.listen(
      (data) {
        final json = jsonDecode(data as String) as Map<String, dynamic>;
        final type = json['type'] as String;
        final request = json['data'] as Map<String, dynamic>;
        switch (type) {
          case 'request_pending':
            _eventController.add(RequestPending(request));
          case 'request_accepted':
            _eventController.add(RequestAccepted(request));
          case 'request_rejected':
            _eventController.add(RequestRejected(request));
        }
      },
      onError: (_) => _scheduleReconnect(),
      onDone: () => _scheduleReconnect(),
    );
  }

  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () {
      final authState = ref.read(authStateProvider);
      if (authState.valueOrNull != null) {
        _connect(authState.requireValue.token);
      }
    });
  }
}
