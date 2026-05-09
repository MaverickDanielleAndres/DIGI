/**
 * Digi — TypeScript Database Types
 * 
 * These types mirror the Supabase PostgreSQL schema exactly.
 * Every table, column, and CHECK constraint is reflected here.
 */

// ============================================================
// ENUM TYPES (must match DB CHECK constraints exactly)
// ============================================================

export type AccountType = 'personal' | 'business';
export type PlanType = 'free' | 'creator' | 'business';
export type EventType = 'wedding' | 'birthday' | 'debut' | 'graduation' | 'reunion' | 'concert' | 'festival' | 'corporate' | 'baby_shower' | 'travel' | 'anniversary' | 'custom';
export type EventStatus = 'draft' | 'active' | 'ended' | 'archived';
export type EventVisibility = 'public' | 'private' | 'invite_only';
export type RevealMode = 'instant' | 'delayed' | 'end_of_event' | 'scheduled' | 'manual' | 'timed_unlocks' | 'anniversary';
export type CameraStyle = 'disposable' | 'polaroid' | 'vhs' | 'vintage' | 'film_grain' | 'bw' | 'camcorder' | 'y2k' | 'digicam' | 'fisheye';
export type ModerationMode = 'auto' | 'manual' | 'off';
export type ParticipantRole = 'owner' | 'co_host' | 'participant' | 'viewer';
export type QRCodeType = 'dynamic' | 'static' | 'expiring' | 'reusable';
export type InvitationStatus = 'pending' | 'accepted' | 'declined';
export type AlbumType = 'shared' | 'personal' | 'highlight' | 'hidden' | 'ai_curated' | 'archived';
export type AlbumLayout = 'timeline' | 'filmstrip' | 'scrapbook' | 'polaroid' | 'story' | 'grid' | 'mood' | 'map';
export type UploadStatus = 'pending' | 'uploading' | 'complete' | 'failed';
export type NoteType = 'text' | 'memory' | 'story' | 'dedication' | 'future';
export type ReactionType = 'heart' | 'sparkle' | 'laugh' | 'cry' | 'wow';
export type ThemeType = 'system' | 'custom' | 'premium';
export type NotificationType = 'upload' | 'reveal' | 'guest_join' | 'reaction' | 'milestone' | 'recap_ready' | 'photobook_shipped' | 'shot_warning' | 'future_memory' | 'comment' | 'badge_earned' | 'event_reminder';
export type ModerationAction = 'approved' | 'rejected' | 'flagged' | 'removed';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';
export type AIContentType = 'recap_video' | 'slideshow' | 'caption' | 'photobook_layout' | 'highlight_reel' | 'year_review';
export type AIContentStatus = 'generating' | 'complete' | 'failed';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trialing';
export type PaymentProvider = 'revenuecat' | 'stripe';
export type PaymentType = 'subscription' | 'photobook' | 'event_upgrade' | 'theme';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BadgeType = 'photographer' | 'memory' | 'funny' | 'contributor' | 'event';
export type ChallengeType = 'secret' | 'hidden' | 'golden_shot';
export type PhotobookStyle = 'classic' | 'editorial' | 'scrapbook' | 'film_noir' | 'polaroid';
export type PhotobookSize = '5x5' | '8x8' | '10x10';
export type PhotobookStatus = 'designing' | 'printing' | 'shipped' | 'delivered';
export type ShotAction = 'captured' | 'used';

// ============================================================
// TABLE INTERFACES
// ============================================================

export interface User {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  account_type: AccountType;
  plan: PlanType;
  brand_name: string | null;
  brand_logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  cover_photo_url: string | null;
  cover_video_url: string | null;
  status: EventStatus;
  visibility: EventVisibility;
  starts_at: string | null;
  ends_at: string | null;
  timezone: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  id: string;
  event_id: string;
  shot_limit_per_participant: number;
  global_shot_limit: number | null;
  cooldown_seconds: number;
  reveal_mode: RevealMode;
  reveal_at: string | null;
  allow_front_camera: boolean;
  allow_flash: boolean;
  allow_retakes: boolean;
  camera_style: CameraStyle;
  moderation_mode: ModerationMode;
  require_approval: boolean;
  max_participants: number | null;
  password_hash: string | null;
  access_window_start: string | null;
  access_window_end: string | null;
  location_restricted: boolean;
  allowed_lat: number | null;
  allowed_lng: number | null;
  allowed_radius_meters: number | null;
  download_enabled: boolean;
  anonymous_mode: boolean;
  event_theme_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface QRCode {
  id: string;
  event_id: string;
  type: QRCodeType;
  code_data: string;
  expires_at: string | null;
  is_active: boolean;
  scan_count: number;
  max_uses: number | null;
  is_revoked: boolean;
  created_at: string;
}

export interface Invitation {
  id: string;
  event_id: string;
  email: string | null;
  phone: string | null;
  status: InvitationStatus;
  sent_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_nickname: string | null;
  role: ParticipantRole;
  shots_used: number;
  joined_at: string;
  last_active_at: string;
  is_banned: boolean;
  is_removed: boolean;
  device_id: string | null;
  push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: string;
  event_id: string;
  name: string;
  type: AlbumType;
  layout: AlbumLayout;
  created_by: string | null;
  is_public: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  event_id: string;
  album_id: string | null;
  uploader_id: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  hd_path: string | null;
  caption: string | null;
  is_revealed: boolean;
  is_approved: boolean;
  is_featured: boolean;
  is_hidden: boolean;
  shot_number: number | null;
  captured_at: string;
  upload_status: UploadStatus;
  latitude: number | null;
  longitude: number | null;
  camera_style_used: string | null;
  ai_caption: string | null;
  ai_tags: string[];
  dedup_hash: string | null;
  blurhash: string | null;
  width: number | null;
  height: number | null;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
}

export interface PhotoNote {
  id: string;
  photo_id: string;
  author_id: string | null;
  content: string;
  note_type: NoteType;
  unlock_at: string | null;
  created_at: string;
}

export interface VoiceNote {
  id: string;
  photo_id: string;
  author_id: string | null;
  storage_path: string;
  duration_seconds: number | null;
  created_at: string;
}

export interface Reaction {
  id: string;
  photo_id: string;
  participant_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface Theme {
  id: string;
  name: string;
  type: ThemeType;
  config: Record<string, unknown>;
  preview_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface EventTheme {
  id: string;
  event_id: string;
  theme_id: string | null;
  custom_overrides: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  event_id: string | null;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  sent_at: string;
  created_at: string;
}

export interface ModerationLog {
  id: string;
  photo_id: string;
  reviewer_id: string | null;
  action: ModerationAction;
  reason: string | null;
  ai_confidence: number | null;
  reviewed_at: string;
  created_at: string;
}

export interface Report {
  id: string;
  photo_id: string;
  reporter_id: string | null;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

export interface AIGeneratedContent {
  id: string;
  event_id: string;
  type: AIContentType;
  storage_path: string | null;
  status: AIContentStatus;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  provider: PaymentProvider | null;
  provider_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount_cents: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  provider: PaymentProvider | null;
  provider_payment_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  type: BadgeType;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  event_id: string | null;
  earned_at: string;
}

export interface Challenge {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  type: ChallengeType;
  reward_badge_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ChallengeCompletion {
  id: string;
  challenge_id: string;
  participant_id: string;
  photo_id: string | null;
  completed_at: string;
}

export interface PhotobookOrder {
  id: string;
  user_id: string;
  event_id: string;
  style: PhotobookStyle;
  page_count: 20 | 40 | 60;
  size: PhotobookSize;
  quantity: number;
  status: PhotobookStatus;
  ai_layout_path: string | null;
  pdf_path: string | null;
  shipping_address: Record<string, unknown> | null;
  price_cents: number | null;
  created_at: string;
  updated_at: string;
}

export interface ShotUsage {
  id: string;
  participant_id: string;
  event_id: string;
  photo_id: string | null;
  action: ShotAction;
  created_at: string;
}

// ============================================================
// COMPOSITE / JOINED TYPES (commonly used in UI)
// ============================================================

export interface EventWithSettings extends Event {
  event_settings: EventSettings | null;
}

export interface EventWithParticipants extends Event {
  participants: Participant[];
  event_settings: EventSettings | null;
}

export interface PhotoWithDetails extends Photo {
  uploader: Participant | null;
  notes: PhotoNote[];
  reactions_count: Record<ReactionType, number>;
  voice_notes: VoiceNote[];
}

export interface ParticipantWithUser extends Participant {
  user: Pick<User, 'display_name' | 'avatar_url'> | null;
}

// ============================================================
// INSERT / UPDATE TYPES
// ============================================================

export type UserInsert = Omit<User, 'created_at' | 'updated_at'>;
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type EventUpdate = Partial<Omit<Event, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>;

export type EventSettingsInsert = Omit<EventSettings, 'id' | 'created_at' | 'updated_at'>;
export type EventSettingsUpdate = Partial<Omit<EventSettings, 'id' | 'event_id' | 'created_at' | 'updated_at'>>;

export type ParticipantInsert = Omit<Participant, 'id' | 'created_at' | 'updated_at' | 'joined_at' | 'last_active_at' | 'shots_used'>;

export type PhotoInsert = Omit<Photo, 'id' | 'created_at' | 'updated_at'>;
