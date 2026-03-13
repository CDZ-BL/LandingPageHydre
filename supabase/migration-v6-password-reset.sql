-- Migration v6: Password Reset Tokens
-- Secure, time-limited password reset links (10 min TTL)

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token       TEXT        NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast token lookup (used in POST /api/auth/reset-password)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token
    ON password_reset_tokens(token);

-- Fast per-user invalidation (used in POST /api/auth/forgot-password)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
    ON password_reset_tokens(user_id);

-- No client-side access — SERVICE_ROLE only
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
