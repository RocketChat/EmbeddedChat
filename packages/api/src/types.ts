/**
 * Type definitions for EmbeddedChat API
 * Issue #1265: Replace 'any' types with proper TypeScript types
 */

export interface User {
  _id: string;
  username: string;
  name?: string;
  status?: string;
  statusText?: string;
  avatarETag?: string;
}

export interface MessageUser {
  _id: string;
  username: string;
  name?: string;
}

export interface Attachment {
  title?: string;
  description?: string;
  title_link?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  type?: string;
  [key: string]: unknown;
}

export interface Message {
  _id: string;
  rid: string;
  msg: string;
  ts: Date | string;
  u: MessageUser;
  attachments?: Attachment[];
  mentions?: MessageUser[];
  channels?: string[];
  editedBy?: MessageUser;
  editedAt?: Date | string;
  [key: string]: unknown; // Allow additional fields from RocketChat
}

export interface ActionData {
  actionId: string;
  value?: string;
  blockId?: string;
  appId?: string;
  [key: string]: unknown;
}

export interface UiInteractionData {
  type: string;
  triggerId?: string;
  payload?: unknown;
  [key: string]: unknown;
}
