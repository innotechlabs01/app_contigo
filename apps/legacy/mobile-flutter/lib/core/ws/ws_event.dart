sealed class WsEvent {
  final Map<String, dynamic> request;
  const WsEvent(this.request);
}

class RequestCreated extends WsEvent {
  const RequestCreated(super.request);
}

class RequestAccepted extends WsEvent {
  const RequestAccepted(super.request);
}

class RequestRejected extends WsEvent {
  const RequestRejected(super.request);
}
