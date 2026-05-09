# structure.md

# Collective Memory Platform - Technical Architecture & System Structure

# Overview

This document contains the complete recommended technical architecture, technology stack, infrastructure decisions, system structure, mobile-first strategy, APIs, libraries, deployment architecture, database design, scaling strategy, and development standards for the Collective Memory Platform.

The system is designed to be:
- Mobile-first
- Real-time
- Offline-capable
- Media-heavy
- Scalable
- AI-enhanced
- Production-ready for 2026 and beyond

---

# Core Technology Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo |
| Web Dashboard | Next.js |
| Backend | Supabase |
| Database | PostgreSQL |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Authentication | Supabase Auth |
| AI Services | Gemini + Qwen |
| Deployment | Vercel |
| Mobile Builds | Expo EAS |
| Email Service | Resend |
| Push Notifications | Expo Notifications |
| Payments | RevenueCat + Stripe |
| Analytics | PostHog |
| Error Monitoring | Sentry |
| CDN | Cloudflare |
| Caching | Upstash Redis |
| Background Jobs | Supabase Edge Functions |

---

# Frontend Architecture

# Mobile App Stack

## Framework
- React Native
- Expo SDK
- TypeScript

Reason:
- Fast development
- Excellent mobile support
- Modern 2026 standard
- Easier native integrations
- Strong ecosystem

---

## Navigation
Use:
- Expo Router

Benefits:
- File-based routing
- Easier scaling
- Better organization
- Modern React Native standard

---

## State Management

## Zustand
Use for:
- UI state
- Temporary state
- Camera state
- Theme state
- User preferences

---

## TanStack Query
Use for:
- Server state
- Realtime caching
- API synchronization
- Optimistic updates
- Offline syncing
- Upload states

---

# Styling System

## NativeWind
TailwindCSS for React Native.

Benefits:
- Faster UI development
- Consistent styling
- Easier theming
- Modern mobile UI workflow

---

# Animation System

## React Native Reanimated
Use for:
- Camera animations
- Album transitions
- Gesture interactions
- Animated galleries
- Theme animations

---

## Gesture System

## React Native Gesture Handler
Use for:
- Swipe interactions
- Pinch zoom
- Gallery gestures
- Drag interactions

---

# Camera & Media Stack

## Camera System
Use:
- Expo Camera

Features:
- Photo capture
- Video capture
- Flash controls
- Camera switching
- Manual controls

---

## Image Manipulation
Use:
- expo-image-manipulator
- react-native-compressor

Purpose:
- Compression
- Resizing
- Optimization
- WebP conversion

---

## File System
Use:
- Expo FileSystem

Purpose:
- Offline uploads
- Upload queues
- Local caching
- Background syncing

---

## Image Rendering
Use:
- expo-image

Benefits:
- Fast image rendering
- Better caching
- Progressive loading

---

# Backend Architecture

# Main Backend

## Supabase

Supabase handles:
- PostgreSQL database
- Authentication
- Storage
- Realtime subscriptions
- Edge functions
- Security policies

---

# Database

## PostgreSQL

Main database tables:

```txt
users
events
participants
albums
photos
photo_notes
voice_notes
reactions
themes
event_settings
notifications
uploads
moderation_logs
ai_generated_content
reports
subscriptions
payments
```

---

# Authentication System

## Supabase Auth

Authentication methods:
- Email magic links
- Google login
- Apple login
- Anonymous guest login
- QR temporary access

Guest access is critical for event participation.

---

# Storage Architecture

# Storage Flow

## Recommended Upload Architecture

Step 1:
Client requests signed upload URL

Step 2:
Supabase Edge Function validates request

Step 3:
Signed upload URL generated

Step 4:
Client uploads directly to storage

Step 5:
Metadata saved to PostgreSQL

---

# Media Optimization Pipeline

## Client Side Optimization
Before upload:
- Compress image
- Resize image
- Remove metadata
- Convert to WebP

---

## Server Side Processing
Generate:
- thumbnails
- previews
- HD originals

---

# Realtime Architecture

## Supabase Realtime

Realtime features:
- Live uploads
- Live reactions
- Live guest feed
- Live slideshow
- Upload counters
- Guest joins
- Album updates

---

# Offline-First Architecture

This is critical because:
- Events may have poor internet
- Upload reliability is essential

---

# Offline Stack

| Purpose | Technology |
|---|---|
| Local Database | Expo SQLite |
| Fast Local Storage | MMKV |
| Offline Upload Queue | Expo FileSystem |
| Cached Queries | TanStack Query Persist |
| Background Sync | React Query Sync |

---

# AI Architecture

# AI Providers

## Gemini
Use for:
- AI recap generation
- Emotional analysis
- Image understanding
- AI captions
- AI moderation
- Smart search

---

## Qwen
Use for:
- Lightweight text tasks
- Cost-efficient summaries
- Metadata generation
- AI assistants
- Tagging

---

# AI Features

## AI Memory Features
- Event recaps
- Emotional summaries
- Highlight generation
- AI-generated captions
- AI-generated storyboards
- Best shot detection
- Duplicate detection

---

## AI Search Features
Search examples:
- "show photos with dancing"
- "show funny moments"
- "show bride smiling"

Requires:
- Vector embeddings
- Semantic search

---

# Notification System

## Push Notifications
Use:
- Expo Notifications

Notification types:
- New uploads
- Reveal unlocks
- Event reminders
- Guest joins
- Reactions
- AI recap ready

---

# Email System

## Resend

Use for:
- Magic links
- Event invitations
- RSVP confirmations
- Event reminders
- Premium receipts
- AI recap delivery

---

# Analytics System

## PostHog

Track:
- Upload success rates
- Event engagement
- Guest retention
- Theme popularity
- Feature usage
- Conversion metrics

---

# Error Monitoring

## Sentry

Track:
- App crashes
- Upload failures
- API failures
- Realtime issues
- Camera errors

Mandatory for production.

---

# Payments Architecture

# Mobile Payments

## RevenueCat
Use for:
- App subscriptions
- Premium themes
- Event upgrades
- Cross-platform billing

---

# Web Payments

## Stripe
Use for:
- Dashboard purchases
- Enterprise plans
- Business accounts

---

# CDN & Performance

# CDN

## Cloudflare
Use for:
- Global CDN
- Faster image delivery
- DDoS protection
- Edge caching

---

# Caching

## Upstash Redis
Use for:
- Session caching
- Feed caching
- AI response caching
- Upload rate limiting

---

# Security Architecture

# Core Security Requirements

## Row Level Security (RLS)
Use Supabase RLS for:
- Private albums
- Guest permissions
- Event ownership
- Moderator controls

---

## Signed Upload URLs
Never expose storage publicly.

---

## Rate Limiting
Protect against:
- Spam uploads
- Abuse
- Bot activity

---

## Moderation
AI-assisted moderation:
- NSFW detection
- Spam detection
- Duplicate filtering

---

# Mobile App Structure

# Recommended Folder Structure

```txt
src/
 ├── app/
 ├── features/
 ├── entities/
 ├── shared/
 ├── services/
 ├── store/
 ├── hooks/
 ├── lib/
 ├── components/
 ├── constants/
 ├── types/
 ├── utils/
 ├── assets/
 ├── providers/
 ├── navigation/
 ├── api/
 ├── theme/
 ├── ai/
 ├── realtime/
 ├── uploads/
 └── notifications/
```

---

# Feature-Based Structure

## Example

```txt
features/
 ├── auth/
 ├── events/
 ├── albums/
 ├── camera/
 ├── uploads/
 ├── reactions/
 ├── themes/
 ├── ai/
 ├── moderation/
 └── notifications/
```

---

# UI/UX Architecture

# Main Navigation

## Bottom Tabs
- Home
- Events
- Camera
- Album
- Settings

---

# Design Philosophy

Focus on:
- Large touch targets
- Minimal friction
- Fast interactions
- Emotional design
- Camera-first UX
- Smooth animations
- Offline resilience

---

# Theme System

Themes should support:
- Dark mode
- Light mode
- Dynamic gradients
- Retro themes
- Wedding themes
- Event branding

---

# Dashboard Architecture

# Web Dashboard Features

## Event Management
- Event configuration
- Guest management
- QR customization
- Album moderation

---

## Analytics Dashboard
- Upload analytics
- Engagement metrics
- Guest tracking
- Revenue metrics

---

## AI Dashboard
- Recap generation
- AI moderation logs
- Highlight generation

---

# Infrastructure Scaling Plan

# MVP Stage

Use:
- Supabase Cloud
- Vercel
- Expo EAS
- Resend

---

# Growth Stage

Add:
- Cloudflare CDN
- Redis caching
- Dedicated AI workers
- Queue systems

---

# Scale Stage

Migrate:
- Media processing
- AI processing
- Heavy realtime systems

to:
- Dedicated containers
- Dedicated workers
- Kubernetes infrastructure

---

# Recommended APIs & Libraries

# Core React Native Libraries

```txt
expo
expo-router
react-native-reanimated
react-native-gesture-handler
nativewind
zustand
@tanstack/react-query
react-hook-form
zod
expo-camera
expo-image
expo-file-system
expo-image-picker
expo-image-manipulator
react-native-compressor
react-native-mmkv
```

---

# Backend Libraries

```txt
@supabase/supabase-js
resend
stripe
posthog-js
@sentry/react-native
```

---

# AI SDKs

```txt
@google/generative-ai
openai
langchain
```

---

# Development Standards

# Code Standards
- TypeScript strict mode
- Feature-first architecture
- Atomic reusable components
- Shared design tokens
- Modular services

---

# Performance Standards
- Lazy loading
- Virtualized lists
- Progressive image loading
- Thumbnail-first rendering
- Background upload queues

---

# Accessibility Standards
- Dynamic font support
- Screen reader support
- High contrast support
- Gesture accessibility

---

# Future Technologies

Potential future additions:
- AR memory overlays
- Smart glasses support
- AI-generated memory books
- Spatial albums
- Voice AI assistants
- Wearable integrations

---

# Final Technical Recommendation

The platform should prioritize:
1. Upload reliability
2. Smooth camera UX
3. Offline support
4. Realtime synchronization
5. Beautiful emotional UI
6. Performance optimization

The emotional experience and frictionless participation are more important than adding excessive AI initially.

The strongest product advantage will come from:
- instant collaborative memories
- beautiful mobile UX
- intentional disposable camera mechanics
- emotional storytelling
