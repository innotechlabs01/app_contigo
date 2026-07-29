package memory

import (
	"sync"
)

// EventHandler is a function that handles an event.
type EventHandler func(event interface{})

// EventBus is an in-memory event bus implementation.
type EventBus struct {
	mu       sync.RWMutex
	handlers map[string][]EventHandler
}

// NewEventBus creates a new in-memory event bus.
func NewEventBus() *EventBus {
	return &EventBus{
		handlers: make(map[string][]EventHandler),
	}
}

// Subscribe registers a handler for an event type.
func (eb *EventBus) Subscribe(eventType string, handler EventHandler) {
	eb.mu.Lock()
	defer eb.mu.Unlock()

	eb.handlers[eventType] = append(eb.handlers[eventType], handler)
}

// Publish sends an event to all subscribers.
func (eb *EventBus) Publish(eventType string, event interface{}) {
	eb.mu.RLock()
	handlers := eb.handlers[eventType]
	eb.mu.RUnlock()

	for _, handler := range handlers {
		handler(event)
	}
}

// Unsubscribe removes all handlers for an event type.
func (eb *EventBus) Unsubscribe(eventType string) {
	eb.mu.Lock()
	defer eb.mu.Unlock()

	delete(eb.handlers, eventType)
}
