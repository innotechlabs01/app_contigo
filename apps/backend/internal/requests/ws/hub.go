package ws

import (
	"encoding/json"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"go.uber.org/zap"

	"github.com/contigo/backend/pkg/logger"
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data,omitempty"`
}

type Hub struct {
	mu    sync.RWMutex
	conns map[string]map[*websocket.Conn]bool
}

func NewHub() *Hub {
	return &Hub{
		conns: make(map[string]map[*websocket.Conn]bool),
	}
}

func (h *Hub) Register(userID string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.conns[userID] == nil {
		h.conns[userID] = make(map[*websocket.Conn]bool)
	}
	h.conns[userID][conn] = true
	logger.Info("WS client registered", zap.String("user_id", userID))
}

func (h *Hub) Unregister(userID string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.conns[userID] != nil {
		delete(h.conns[userID], conn)
		if len(h.conns[userID]) == 0 {
			delete(h.conns, userID)
		}
	}
	logger.Info("WS client unregistered", zap.String("user_id", userID))
}

func (h *Hub) SendToUser(userID string, msg Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	conns := h.conns[userID]
	if conns == nil { return }
	data, err := json.Marshal(msg)
	if err != nil {
		logger.Error("WS marshal error", zap.Error(err))
		return
	}
	for conn := range conns {
		if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
			logger.Error("WS write error", zap.Error(err))
			conn.Close()
			go h.Unregister(userID, conn)
		}
	}
}

func (h *Hub) SendToUsers(userIDs []string, msg Message) {
	for _, uid := range userIDs {
		h.SendToUser(uid, msg)
	}
}
