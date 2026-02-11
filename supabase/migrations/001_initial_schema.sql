-- Valentine2 Initial Schema
-- EPIC 2: Data model + storage + public card link

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CARDS TABLE
-- Stores the valentine card data with public token for sharing
-- =============================================================================
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  
  -- Template snapshot (stores template data at creation time)
  template_snapshot JSONB NOT NULL,
  
  -- Card content
  to_name TEXT,
  from_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  tone TEXT NOT NULL,
  message_text TEXT NOT NULL,
  image_path TEXT, -- Custom image path (e.g., for Office/Taylor cards)
  
  -- Lifecycle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  is_blocked BOOLEAN DEFAULT false,
  
  -- Constraints
  CONSTRAINT message_text_length CHECK (char_length(message_text) <= 500),
  CONSTRAINT to_name_length CHECK (to_name IS NULL OR char_length(to_name) <= 32),
  CONSTRAINT from_name_length CHECK (from_name IS NULL OR char_length(from_name) <= 32)
);

-- Index for fast token lookups (public card URL)
CREATE INDEX idx_cards_token ON cards(token);

-- Index for cleanup job (finding expired cards)
CREATE INDEX idx_cards_expires_at ON cards(expires_at) WHERE expires_at IS NOT NULL;

-- Index for blocked cards
CREATE INDEX idx_cards_is_blocked ON cards(is_blocked) WHERE is_blocked = true;

-- =============================================================================
-- ORDERS TABLE
-- Prepared for EPIC 3 (payments, email delivery)
-- =============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  
  -- Order status: draft | paid | scheduled | sent | failed
  status TEXT DEFAULT 'draft',
  
  -- Delivery info (for future email feature)
  recipient_email TEXT,
  send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('draft', 'paid', 'scheduled', 'sent', 'failed')),
  CONSTRAINT valid_email CHECK (recipient_email IS NULL OR recipient_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for order status queries
CREATE INDEX idx_orders_status ON orders(status);

-- Index for scheduled sends
CREATE INDEX idx_orders_send_at ON orders(send_at) WHERE send_at IS NOT NULL AND status = 'scheduled';

-- =============================================================================
-- EVENTS TABLE
-- Audit log + analytics (card views, blocks, etc.)
-- =============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- References (nullable for flexibility)
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Event type: created | opened | blocked | unblocked | expired | sent
  type TEXT NOT NULL,
  
  -- Additional metadata (IP, user agent, etc.)
  meta JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_event_type CHECK (type IN ('created', 'opened', 'blocked', 'unblocked', 'expired', 'sent'))
);

-- Index for card event history
CREATE INDEX idx_events_card_id ON events(card_id) WHERE card_id IS NOT NULL;

-- Index for event type queries
CREATE INDEX idx_events_type ON events(type);

-- Index for time-based queries
CREATE INDEX idx_events_created_at ON events(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read non-blocked, non-expired cards by token
CREATE POLICY "Public can read cards by token" ON cards
  FOR SELECT
  USING (
    NOT is_blocked 
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Service role can do everything (bypasses RLS anyway, but explicit)
-- Note: Service role key bypasses RLS by default

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for orders updated_at
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
