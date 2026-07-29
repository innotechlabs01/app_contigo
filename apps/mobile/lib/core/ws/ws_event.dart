sealed class WsEvent {
  final Map<String, dynamic> request;
  const WsEvent(this.request);
}

class RequestPending extends WsEvent {
  const RequestPending(super.request);
}

class RequestAccepted extends WsEvent {
  const RequestAccepted(super.request);
}

class RequestRejected extends WsEvent {
  const RequestRejected(super.request);
}
