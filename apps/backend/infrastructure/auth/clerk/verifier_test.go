package clerk

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"math/big"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestParseRSAPublicKey(t *testing.T) {
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	require.NoError(t, err)

	n := base64.RawURLEncoding.EncodeToString(key.PublicKey.N.Bytes())
	e := base64.RawURLEncoding.EncodeToString(big.NewInt(int64(key.PublicKey.E)).Bytes())

	parsed, err := parseRSAPublicKey(n, e)
	require.NoError(t, err)
	require.Equal(t, key.PublicKey.N, parsed.N)
	require.Equal(t, key.PublicKey.E, parsed.E)
}

func TestParseRSAPublicKeyInvalid(t *testing.T) {
	_, err := parseRSAPublicKey("not-base64", "AQAB")
	require.Error(t, err)
}
