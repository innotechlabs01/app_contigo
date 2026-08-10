package clerk

import (
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/go-jose/go-jose/v4"
	"github.com/golang-jwt/jwt/v5"
)

// Claims represents the JWT claims from Clerk.
type Claims struct {
	UserID string   `json:"sub"`
	OrgID  string   `json:"org_id"`
	Roles  []string `json:"roles"`
	jwt.RegisteredClaims
}

// Verifier verifies Clerk JWTs using JWKS.
type Verifier interface {
	Verify(tokenString string) (*Claims, error)
}

// JWKSVerifier implements Verifier using Clerk's JWKS endpoint.
type JWKSVerifier struct {
	jwksURL    string
	issuer     string
	httpClient *http.Client
	mu         sync.RWMutex
	keys       map[string]*rsa.PublicKey
	lastFetch  time.Time
}

// NewJWKSVerifier creates a new JWKSVerifier.
func NewJWKSVerifier(jwksURL, issuer string) *JWKSVerifier {
	return &JWKSVerifier{
		jwksURL: jwksURL,
		issuer:  issuer,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		keys: make(map[string]*rsa.PublicKey),
	}
}

// Verify verifies a JWT token and returns the claims.
func (v *JWKSVerifier) Verify(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		kid, ok := t.Header["kid"].(string)
		if !ok {
			return nil, fmt.Errorf("missing kid in token header")
		}

		key, err := v.getKey(kid)
		if err != nil {
			return nil, err
		}
		return key, nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	// Validate issuer if configured
	if v.issuer != "" && claims.Issuer != v.issuer {
		return nil, fmt.Errorf("invalid issuer: expected %s, got %s", v.issuer, claims.Issuer)
	}

	return claims, nil
}

func (v *JWKSVerifier) getKey(kid string) (*rsa.PublicKey, error) {
	// Try cache first
	v.mu.RLock()
	if key, ok := v.keys[kid]; ok && time.Since(v.lastFetch) < 1*time.Hour {
		v.mu.RUnlock()
		return key, nil
	}
	v.mu.RUnlock()

	// Fetch keys from JWKS endpoint
	return v.fetchKey(kid)
}

func (v *JWKSVerifier) fetchKey(kid string) (*rsa.PublicKey, error) {
	v.mu.Lock()
	defer v.mu.Unlock()

	// Double-check after acquiring write lock
	if key, ok := v.keys[kid]; ok && time.Since(v.lastFetch) < 1*time.Hour {
		return key, nil
	}

	resp, err := v.httpClient.Get(v.jwksURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKS: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read JWKS response: %w", err)
	}

	var jwks struct {
		Keys []struct {
			Kid string `json:"kid"`
			N   string `json:"n"`
			E   string `json:"e"`
		} `json:"keys"`
	}

	if err := json.Unmarshal(body, &jwks); err != nil {
		return nil, fmt.Errorf("failed to parse JWKS: %w", err)
	}

	// Update cache
	v.keys = make(map[string]*rsa.PublicKey)
	for _, k := range jwks.Keys {
		key, err := parseRSAPublicKey(k.N, k.E)
		if err != nil {
			continue
		}
		v.keys[k.Kid] = key
	}
	v.lastFetch = time.Now()

	if key, ok := v.keys[kid]; ok {
		return key, nil
	}

	return nil, fmt.Errorf("key not found: %s", kid)
}

func parseRSAPublicKey(n, e string) (*rsa.PublicKey, error) {
	jwkJSON := fmt.Sprintf(`{"kty":"RSA","n":%q,"e":%q}`, n, e)
	var jwk jose.JSONWebKey
	if err := json.Unmarshal([]byte(jwkJSON), &jwk); err != nil {
		return nil, fmt.Errorf("failed to parse JWK: %w", err)
	}
	pub, ok := jwk.Key.(*rsa.PublicKey)
	if !ok || pub.E < 3 || pub.N == nil || pub.N.BitLen() < 2048 {
		return nil, fmt.Errorf("invalid RSA public key")
	}
	return pub, nil
}
