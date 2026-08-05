package ws

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/fasthttp/websocket"
	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"

	"github.com/contigo/backend/pkg/logger"
)

const (
	pongTimeout = 60 * time.Second
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data,omitempty"`
}

type Hub struct {
	mu      sync.RWMutex
	conns   map[string]map[*websocket.Conn]bool
	upgrade websocket.FastHTTPUpgrader
}

func NewHub() *Hub {
	return &Hub{
		conns: make(map[string]map[*websocket.Conn]bool),
	}
}

// HandleWebSocket returns a fiber.Handler that upgrades to WebSocket.
// It expects user_id to be set in fiber.Ctx.Locals (by auth middleware).
func (h *Hub) HandleWebSocket() fiber.Handler {
	return func(c fiber.Ctx) error {
		userID := c.Locals("user_id").(string)
		if userID == "" {
			return fiber.ErrUnauthorized
		}

		return h.upgrade.Upgrade(c.RequestCtx(), func(conn *websocket.Conn) {
			h.Register(userID, conn)
			defer h.Unregister(userID, conn)

			conn.SetReadDeadline(time.Now().Add(pongTimeout))
			conn.SetPongHandler(func(string) error {
				conn.SetReadDeadline(time.Now().Add(pongTimeout))
				return nil
			})

			for {
				_, _, err := conn.ReadMessage()
				if err != nil {
					break
				}
			}
		})
	}
}

func (h *Hub) Broadcast(msg Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	data, err := json.Marshal(msg)
	if err != nil {
		logger.Error("WS marshal error", zap.Error(err))
		return
	}
	for _, conns := range h.conns {
		for conn := range conns {
			if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
				logger.Error("WS write error", zap.Error(err))
				conn.Close()
			}
		}
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
