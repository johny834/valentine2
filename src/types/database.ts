/**
 * Database types for Valentine2
 * These types mirror the Supabase schema
 */

export type CardStatus = "active" | "expired" | "blocked";
export type OrderStatus = "draft" | "paid" | "scheduled" | "sent" | "failed";
export type EventType = "created" | "opened" | "blocked" | "unblocked" | "expired" | "sent";

/**
 * Template snapshot stored with each card
 * Preserves template state at creation time
 */
export interface TemplateSnapshot {
  id: string;
  name: string;
  illustrationPath: string;
  styleTokens: {
    primaryColor: string;
    accentColor: string;
    fontStyle?: string;
  };
}

/**
 * Card record from database
 */
export interface Card {
  id: string;
  token: string;
  template_snapshot: TemplateSnapshot;
  to_name: string | null;
  from_name: string | null;
  is_anonymous: boolean;
  tone: string;
  message_text: string;
  image_path: string | null;
  created_at: string;
  expires_at: string | null;
  is_blocked: boolean;
}

/**
 * Card insert payload (for creating new cards)
 */
export interface CardInsert {
  token: string;
  template_snapshot: TemplateSnapshot;
  to_name?: string | null;
  from_name?: string | null;
  is_anonymous?: boolean;
  tone: string;
  message_text: string;
  image_path?: string | null;
  expires_at?: string | null;
}

/**
 * Order record from database
 */
export interface Order {
  id: string;
  card_id: string;
  status: OrderStatus;
  recipient_email: string | null;
  send_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Order insert payload
 */
export interface OrderInsert {
  card_id: string;
  status?: OrderStatus;
  recipient_email?: string | null;
  send_at?: string | null;
}

/**
 * Event record from database
 */
export interface Event {
  id: string;
  card_id: string | null;
  order_id: string | null;
  type: EventType;
  meta: Record<string, unknown>;
  created_at: string;
}

/**
 * Event insert payload
 */
export interface EventInsert {
  card_id?: string | null;
  order_id?: string | null;
  type: EventType;
  meta?: Record<string, unknown>;
}

/**
 * Public card data (safe to expose)
 */
export interface PublicCard {
  token: string;
  toName: string | null;
  fromName: string | null;
  messageText: string;
  tone: string;
  imagePath: string | null;
  template: TemplateSnapshot;
  createdAt: string;
  expiresAt: string | null;
}

/**
 * API response for card creation
 */
export interface CreateCardResponse {
  token: string;
  publicUrl: string;
  orderId: string;
}
