import 'dart:async';
import 'dart:convert';
import 'dart:io' show WebSocket;
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';

import '../../features/auth/presentation/view_models/auth_view_model.dart';
import '../../core/di/providers.dart';
import '../../core/network/api_endpoints.dart';
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
    final user = authState.asData?.value;
    if (user != null) {
      _connect();
    }

    return const AsyncValue.data(null);
  }

  Future<void> _connect() async {
    _channel?.sink.close();
    final storage = ref.read(secureStorageServiceProvider);
    final token = await storage.read('clerk_session_token');
    if (token == null) return;
    final uri = Uri.parse('$kApiWsUrl/requests/ws');
    final ws = await WebSocket.connect(
      uri.toString(),
      headers: {'Authorization': 'Bearer $token'},
    );
    _channel = IOWebSocketChannel(ws);
    _subscription = _channel!.stream.listen(
      (data) {
        final json = jsonDecode(data as String) as Map<String, dynamic>;
        final type = json['type'] as String;
        final request = json['data'] as Map<String, dynamic>;
        switch (type) {
          case 'request_created':
            _eventController.add(RequestCreated(request));
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
      _connect();
    });
  }
}
