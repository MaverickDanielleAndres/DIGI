# Collective Memory Platform — Design System & UX Bible

---

## Design Philosophy

> **"A camera roll that feels like a feeling."**

This is not a utility app. It is an *emotional artifact machine*. Every screen, animation, and interaction should feel like you are holding something precious — a physical object that captures a moment in time.

The aesthetic direction: **Warm Cinematic Noir** — deeply dark backgrounds, warm amber/gold tones, soft film grain, and moments of pure white or vivid color that feel like light leaking through film. Playful but intentional. Emotional but not sentimental.

The unforgettable element: **Every screen feels like opening a letter from someone you love.**

---

## Design Pillars

| Pillar | Expression |
|---|---|
| Cinematic | Film grain textures, dark backgrounds, widescreen-inspired crops |
| Warm | Amber, cream, terracotta color accents |
| Playful | Hand-drawn-feel type, bounce animations, confetti moments |
| Intentional | Scarcity UI (shot counters), deliberate tap interactions |
| Emotional | Smooth reveals, letter-opening transitions, memory moments |

---

## Color System

### Core Palette

```
--color-void         : #0A0806     // Near-black with warm undertone (base background)
--color-charcoal     : #141210     // Card backgrounds
--color-graphite     : #1E1A17     // Elevated surfaces
--color-smoke        : #2C2520     // Borders, dividers
--color-ash          : #4A3F38     // Muted text, disabled states

--color-cream        : #F5EDD8     // Primary light text, headings
--color-ivory        : #EDE0C4     // Secondary text
--color-parchment    : #D4C4A8     // Tertiary text, captions

--color-amber        : #F4A535     // PRIMARY ACCENT — CTAs, shot counter, highlights
--color-amber-soft   : #F7BC6A     // Hover/active states
--color-amber-glow   : rgba(244, 165, 53, 0.15)  // Glow effects, tinted backgrounds

--color-coral        : #E8603A     // Secondary accent — notifications, badges
--color-blush        : #E8A090     // Memory notes, soft interactions
--color-sage         : #8BAF8A     // Success states, confirmed actions
--color-sky          : #7BB3D4     // Informational, viewer-only indicators

--color-film-grain   : rgba(255, 220, 150, 0.03)  // Layered texture
--color-vignette     : rgba(0, 0, 0, 0.6)         // Edge darkening on photos
```

### Dark Theme (Default — Primary Experience)

All mobile screens use the dark theme. It feels cinematic, battery-efficient on OLED, and makes photos POP with contrast.

### Light Theme (Selective Use)

Used only for:
- Photobook preview pages
- Printed/export previews
- Onboarding step 1 (first impression contrast)

Light mode palette:
```
--light-bg           : #FAF6EE
--light-surface      : #F0E9D8
--light-border       : #DDD0B8
--light-text         : #1A1510
--light-accent       : #C8751A
```

---

## Typography

### Font Stack

```
Display / Hero         : "Canela" or "Playfair Display" — editorial serif, emotional weight
Heading / UI           : "Syne" — geometric, slightly condensed, modern confidence  
Body / Captions        : "DM Sans" — clean, warm, highly readable at small sizes
Monospace / Counters   : "JetBrains Mono" — shot counters, timestamps, numeric data
Handwriting Accents    : "Caveat" — used sparingly for "from [name]" tags, emotional notes
```

### Type Scale

```
--text-hero     : 52px / line-height 1.05 / letter-spacing -0.02em  (Canela)
--text-display  : 38px / line-height 1.1  / letter-spacing -0.02em  (Canela)
--text-h1       : 28px / line-height 1.2  / letter-spacing -0.01em  (Syne 700)
--text-h2       : 22px / line-height 1.3  / letter-spacing -0.01em  (Syne 600)
--text-h3       : 18px / line-height 1.4  / letter-spacing 0        (Syne 500)
--text-body     : 15px / line-height 1.6  / letter-spacing 0        (DM Sans 400)
--text-small    : 13px / line-height 1.5  / letter-spacing 0.01em   (DM Sans 400)
--text-micro    : 11px / line-height 1.4  / letter-spacing 0.03em   (DM Sans 500)
--text-counter  : 32px / line-height 1    / letter-spacing -0.03em  (JetBrains Mono 700)
--text-note     : 15px / line-height 1.7  / letter-spacing 0        (Caveat 500)
```

---

## Spacing & Layout

```
--space-1  : 4px
--space-2  : 8px
--space-3  : 12px
--space-4  : 16px
--space-5  : 20px
--space-6  : 24px
--space-8  : 32px
--space-10 : 40px
--space-12 : 48px
--space-16 : 64px

--radius-sm  : 8px
--radius-md  : 16px
--radius-lg  : 24px
--radius-xl  : 32px
--radius-pill: 999px

--safe-top    : env(safe-area-inset-top)
--safe-bottom : env(safe-area-inset-bottom)
```

---

## Iconography

Style: **Rounded, 1.5px stroke weight**, with occasional filled variants for selected states.

Icon library base: Lucide Icons — customized to feel slightly hand-crafted.

Special icons unique to this app:
- 🎞 Film roll (shot counter)
- 📷 Disposable camera shutter
- 🔓 Reveal lock / unlock
- ✉️ Memory note envelope
- ⏳ Future unlock hourglass

Icon sizes:
```
--icon-sm  : 16px
--icon-md  : 20px  (default)
--icon-lg  : 24px
--icon-xl  : 32px
```

---

## Motion & Animation

### Principles
- **Purposeful**: Every animation has a reason. No idle decorations.
- **Fast entries, slow exits**: Elements snap in (150–200ms) and fade out gently (250–350ms).
- **Spring physics**: Use spring-based easing for interactive elements (feels tactile).
- **Emotional moments get longer treatment**: Reveal animations, photo openings, memory notes = 400–800ms.

### Key Animations

#### Shutter Click
```
Trigger: Photo capture
Animation: 
  - Screen flashes white briefly (80ms)
  - Camera frame briefly compresses scale(0.97) then bounces back (spring)
  - Shot counter decreases with a flip animation (like old flip clocks)
Duration: 300ms total
Sound: Optional shutter click haptic
```

#### Film Reveal (Delayed Reveal Unlock)
```
Trigger: Event reveal time reached
Animation:
  - Dark screen with film grain pulsing
  - Gold light bleeds in from top-left corner
  - Photos materialize one by one (staggered, 120ms apart)
  - Each photo does a soft "develop" fade from sepia → full color
Duration: 800ms per photo + stagger
```

#### Memory Note Open
```
Trigger: Tap a note/caption on a photo
Animation:
  - Background blurs (backdrop-filter: blur(20px))
  - Note card slides up from bottom with spring
  - Text appears with typewriter-style fade-in
Duration: 350ms
```

#### QR Code Reveal
```
Trigger: Host opens QR share
Animation:
  - QR code zooms from center (scale 0 → 1, spring)
  - Decorative particles orbit the QR briefly
  - Event name types itself below
Duration: 500ms
```

#### Shot Counter Warning
```
Trigger: Last 3 shots remaining
Animation:
  - Counter pulses amber
  - Subtle haptic pattern
  - "3 shots left" toast slides in from top
```

#### Page Transitions
```
Default: Slide left/right (native-feeling, 250ms ease-out)
Camera → Album: Cross-fade with scale-down (cinematic)
Join event: Full-screen immersive push (event cover expands to fill screen)
```

---

## Screen-by-Screen Design Specification

---

### 00. SPLASH / LAUNCH SCREEN

**Visual:**
- Near-black background (#0A0806)
- Centered wordmark in Canela italic — warm cream color
- App name: **"Pov"** or your brand name in large display type
- Subtle film grain texture overlay
- Gold dot of light pulses once and disappears

**Transition into app:** Film projector flicker (3 quick white flashes) then reveals the next screen.

---

### 01. ONBOARDING — "THE HOOK" SCREENS

This is the most important UX moment. Must create emotional desire in under 10 seconds.

**Structure:** 3 cinematic full-screen slides, swipe or auto-advance (4s each)

---

#### Slide 1 — THE EMOTIONAL HOOK
```
Background: Full-bleed photo of a warm wedding/party moment (blurred slightly)
Overlay: Dark gradient from bottom
Large serif display text (Canela):
  "Every guest.
  Every perspective.
  One memory."

Subtext (DM Sans, small, parchment color):
  "A disposable camera experience for your events."

Visual accent: Small film strip icon in amber, top-right
```

#### Slide 2 — THE MECHANIC HOOK  
```
Background: Dark cinematic #0A0806
Center: Animated disposable camera graphic
  - Film counter ticks down: 24 → 23 → 22
  - Flash graphic pulses amber
  - Photo slides out into a growing stack

Text overlay:
  "Limited shots.
  Unlimited memories."

Subtext: "Scarcity makes every click matter."
```

#### Slide 3 — THE REVEAL HOOK
```
Background: Dark with light leak from top
Center: Stack of blurred/locked photos with a padlock
Animation plays: Lock opens, photos "develop" from grainy → vivid
  
Text: "Reveal them
  together."

Subtext: "Photos unlock when you decide. 
  The anticipation is the experience."

CTA Button appears (amber, pill shape):
  "Get started →"
```

---

### 02. SIGN UP / SIGN IN — ACCOUNT TYPE SELECTION

**Visual Design:**
- Full dark background
- Two large cards side-by-side (or stacked on mobile):

```
┌─────────────────────┐  ┌─────────────────────┐
│                     │  │                     │
│  👤  Personal       │  │  🏢  Business        │
│                     │  │                     │
│  For friends,       │  │  For planners,       │
│  family & you       │  │  agencies & pros     │
│                     │  │                     │
│  Free to start      │  │  Team features       │
└─────────────────────┘  └─────────────────────┘
```

Card design:
- Dark charcoal surface (#141210)
- Amber border on hover/selected
- Icon large and centered, warm amber color
- Title in Syne 600
- Description in DM Sans body
- Checkmark appears when selected

Below cards:
```
[Continue →]  (amber pill button, full width)

Already have an account? Sign in
```

---

### 03. SIGN UP FORM

**Design:**
- Dark background, single column
- Large input fields with bottom-border-only style (feels premium)
- Input labels float up on focus (animated)
- Fields:
  - Full name
  - Email
  - Password
  - (Business only): Business/brand name

Social sign-in row:
```
──── or continue with ────

[G Google]  [  Apple]
```

Progress indicator: Small dots at top (3-step signup)

---

### 04. HOME SCREEN (Authenticated)

**Visual:**
- Header: App logo left, notification bell + profile avatar right
- Greeting text (Canela italic): *"Good evening, [Name]."*
- Below: A large hero card for the most recent/upcoming event

**Event Card Design (Hero):**
```
┌────────────────────────────────────┐
│                                    │
│  [Full-bleed event cover photo]    │
│                                    │
│  ╔══════════════════════════════╗  │
│  ║ CHLOE & TYLER'S WEDDING      ║  │
│  ║ Tonight · 47 guests · 🔴 Live ║  │
│  ╚══════════════════════════════╝  │
│                                    │
│  [Open Event →]                    │
└────────────────────────────────────┘
```

Card details:
- Film grain overlay on the photo
- Gradient from transparent top → dark bottom
- Event title in Syne 700, cream color
- Amber dot for "Live" status
- Rounded corners 24px

**Below hero:** Horizontal scroll of past events as smaller "film roll" cards

**Past event card:**
```
[ Photo thumbnail ]
  Event name
  Jun 14 · 168 photos
```
Film strip perforations on top and bottom of the card row (decorative)

**Quick Action Row:**
```
[+ Create Event]  [Scan QR]  [Photobook]
```
Pill buttons, icon + label, dark surface with amber accent

---

### 05. CREATE EVENT SCREEN

**Design:**
- Stepped form — feels like filling out a physical invitation
- Step indicator at top: 4 steps shown as small film frames (●●○○)

**Step 1: The Basics**
```
Event Name field (large, Canela input style)
Event Type selector (horizontal scrollable chips):
  [Wedding] [Birthday] [Debut] [Graduation] [Concert] [+More]
  
  Selected chip: amber fill, dark text
  Unselected: dark surface, cream text

Date & Time picker (custom styled, warm dark theme)
```

**Step 2: The Look**
- Cover photo upload: Large dashed upload zone with camera icon
- Theme picker: Horizontal scroll of preview thumbnails
  - Cinematic Dark
  - Wedding White
  - Retro Beige
  - Y2K Chrome
  - Luxury Gold
  - Neon Night

**Step 3: Camera Rules**
```
Shots per guest: [  24  ] ← custom stepper (+/-)
Cooldown timer: Toggle → [  0 min  ]
Delayed reveal: Toggle
  └── If on: Reveal date/time picker appears

Camera restrictions: Toggle group
  ● Front camera only
  ○ Back camera only  
  ○ Both (default)
```

**Step 4: Access**
```
Access type chips:
  [QR Code] [Invite Link] [Password] [Approval]

Guest limit: Toggle + number input
```

Final CTA: **"Create Event"** — full-width amber button

---

### 06. QR CODE SHARE SCREEN

**This screen should feel like a cinema ticket or concert poster.**

```
Background: Event theme color or dark cinematic
Center: 
  ┌─────────────────────┐
  │   ░░░░░░░░░░░░░░   │  ← Stylized QR with event branding
  │   ░░ [QR CODE] ░░   │
  │   ░░░░░░░░░░░░░░   │
  └─────────────────────┘
  
  [Event logo/monogram above QR]
  
  "Chloe & Tyler"            ← Canela display
  "Scan to join the moment"  ← DM Sans small

  ── Download ──  ── Share ──  ── Customize ──
```

QR Customization panel (slides up):
- Color picker for QR dots
- Logo upload
- Frame style selector
- Animated toggle (the QR subtly pulses/breathes)

---

### 07. GUEST JOIN EXPERIENCE (No Download — App Clip / Web)

**This is the first thing most users will see. Must be stunning.**

**App Clip (iOS) / Web Page (Android) design:**

Full-screen immersive:
```
[Event cover photo fills entire screen]

[Film grain overlay animated slowly]

Floating card from bottom (spring animation):
┌────────────────────────────────┐
│                                │
│  Chloe & Tyler                 │  ← Canela 28px
│  Wedding · Jun 14              │  ← DM Sans small, parchment
│                                │
│  "We want your POV documented" │  ← Guest message, Caveat font
│  — Chloe & Tyler               │
│                                │
│  [🎞 15 shots each]            │  ← Shot limit info
│                                │
│  [  Join the moment  →  ]      │  ← Large amber CTA button
│                                │
│  No download needed.           │  ← DM Sans micro, gray
└────────────────────────────────┘
```

After "Join": Quick name/nickname input (optional), then straight to camera.

---

### 08. CAMERA SCREEN

**The heart of the experience. Full-screen, immersive, cinematic.**

```
┌────────────────────────────────┐
│                     [⚙️] [↗️] │  ← Settings, share (top right)
│                                │
│  Chloe & Tyler >               │  ← Tappable event name (top left)
│  Ends at 11:59pm               │
│                                │
│                                │
│    [LIVE VIEWFINDER]           │
│                                │
│                                │
│                                │
│                                │
│  ⚡ [1x] [2x]    [📷 flip]    │  ← Flash toggle, zoom, flip camera
│                                │
│  ┌──────┐                      │
│  │ PREV │  [◎ SHUTTER]  [...]  │  ← Previous capture thumbnail
│  │ SHOT │                      │    Shutter button (large, center)
│  └──────┘                      │    3-dot for note/draft mode
│                                │
│  ██ 12 SHOTS REMAINING ██      │  ← Bottom amber bar
└────────────────────────────────┘
```

**Shot Counter Design:**
- Full-width amber bar at very bottom
- JetBrains Mono "12 SHOTS REMAINING"
- As shots decrease:
  - 10+ shots: amber
  - 5 shots: coral/orange
  - 3 shots: red pulse animation
  - Last shot: dramatic shake + warning

**Shutter Button:**
- 72px circle, white fill
- Inner ring: camera aperture blades (SVG animated on press)
- On press: scales down 0.92, haptic feedback, screen flash

**Previous Shot Thumbnail:**
- Bottom left, 48x48px rounded square
- Tapping opens full album

**Note/Draft Mode (3-dot menu):**
```
Sheet slides up:
  "Save as draft & add a note?"
  [ Yes, add note ] [ Just post it ]
```

---

### 09. MEMORY NOTE SCREEN

```
Full background: blurred version of the photo
Top: The photo itself (60% screen height)

Below:
┌────────────────────────────────┐
│  📝 Add a memory note          │
│                                │
│  [Text input — Caveat font]    │
│  "Write what this moment       │
│   means to you..."             │
│                                │
│  [ Voice note 🎙 ]             │
│                                │
│  [  Post with note →  ]        │
│  [  Post without note  ]       │
└────────────────────────────────┘
```

---

### 10. ALBUM / GALLERY SCREEN

**Layout Selector (top tab bar):**
```
[Timeline] [Film Strip] [Polaroid Wall] [Story]
```
Sliding underline indicator in amber.

**Default: Timeline View**
```
Date header: "June 14 — 6:47 PM"  ← small, parchment, Syne

Photos in 2-column masonry grid
Each photo card:
  - Rounded corners 16px
  - Contributor avatar (bottom-left corner, 24px circle)
  - "From Kate" (Caveat, cream, bottom)
  - If has note: ✉️ envelope icon (amber) top-right corner
  - Reactions count if any (bottom-right)
```

**Film Strip View:**
```
Horizontal scroll, photos displayed as actual film frames
  - Black film sprocket holes top and bottom (decorative)
  - Photos in 1:1 crop inside frames
  - Date/time printed below each like real film
```

**Polaroid Wall View:**
```
Random slight rotations (-3° to +3°)
White border around photos (polaroid style)
Caption in Caveat below each
Scattered layout, slight shadow
```

---

### 11. PHOTO DETAIL SCREEN

```
Full-screen photo
Tap to toggle UI visibility

UI visible state:
  Top: Back arrow, [Share] [⋯ more]
  
  Bottom card (slides up):
  ┌────────────────────────────────┐
  │  👤 Kate W.                    │
  │  Jun 14 · 9:42 PM              │
  │                                │
  │  ✉️ "I was right next to them  │   ← Memory note in Caveat
  │  when this happened, crying    │
  │  happy tears 😭"               │
  │                                │
  │  [❤️ 12]  [💬 3]  [✨ Share]   │
  └────────────────────────────────┘
```

---

### 12. REVEAL SCREEN (Delayed Reveal Unlock)

**This is the app's most emotional moment. Design it like an event.**

```
State 1 — Locked:
  Dark screen
  Large hourglass icon (animated, sand falling)
  
  Countdown timer:
  "REVEALS IN"
  [02] : [14] : [33]  ← JetBrains Mono, large
  hrs    min    sec
  
  "48 memories waiting"
  (DM Sans, parchment)

State 2 — Unlocking (timer hits 0):
  Hourglass cracks → light spills out
  Gold light ray sweeps across screen
  Film grain effect intensifies briefly
  
  Text fades in (Canela italic):
  "The wait is over."

State 3 — Revealing:
  Photos bloom onto screen one by one
  Each develops: grainy → sepia → full color (800ms per photo)
  
  Confetti burst: amber + cream particles

State 4 — Complete:
  All photos revealed, normal album view
  Celebratory toast: "48 memories revealed ✨"
```

---

### 13. PHOTOBOOK SCREEN

**"Turn your gallery into a real photobook. We'll do all the work."**

```
Full warm cream/light background (rare light theme moment)

Hero section:
  [Preview of a beautiful printed photobook mockup]
  
  "Your memories, printed."  ← Canela display
  "We'll lay it out beautifully."  ← DM Sans body

Style selector (horizontal scroll):
  [Classic]  [Editorial]  [Scrapbook]  [Film Noir]
  Each shows a mini preview spread

Page count / size selector:
  20, 40, 60 pages
  5x5", 8x8", 10x10"

Price display:
  Starting from ₱1,499  (or localized currency)

[  Preview my book →  ]  ← amber CTA

[  Order physical copy  ]  ← secondary button
[  Download PDF  ]  ← tertiary/text link
```

---

### 14. DASHBOARD SCREEN (Owner — Mobile)

**Design: Dark, data-rich but not overwhelming.**

```
Top: "Event Dashboard" header + event selector dropdown

Stat cards (2x2 grid):
┌──────────────┐  ┌──────────────┐
│  🖼          │  │  👥          │
│  168         │  │  47          │
│  Photos      │  │  Guests      │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  ❤️          │  │  💾          │
│  342         │  │  2.3 GB      │
│  Reactions   │  │  Storage     │
└──────────────┘  └──────────────┘

Card style:
  - Dark charcoal surface
  - Icon in amber
  - Number in Syne 700, cream, large
  - Label in DM Sans micro, ash color

Sections below:
  "Most active photographers"  → horizontal avatars
  "Most reacted photos"        → mini photo strip
  "Upload activity"            → simple bar chart (amber bars)
  
  [Moderation Queue]  badge with count if pending
  [Guest Management]
  [Reveal Settings]
  [Export / Photobook]
```

---

### 15. SETTINGS & PROFILE SCREEN

```
Top: Large avatar circle (amber ring), name (Canela), account type badge

Sections (grouped cards):
  Account
    - Edit profile
    - Account type: Personal / Business
    - Subscription plan badge

  My Events
    - Active events
    - Past events
    - Archived

  Preferences
    - Notifications
    - Default camera settings
    - Theme (Dark / Light / System)
    
  Storage & Export
    - Storage used
    - Download all photos
    - Photobook orders

  Privacy & Security
    - Privacy settings
    - Connected accounts
    - Delete account

  Business (if business account)
    - Brand settings
    - Team members
    - Analytics
```

---

## Landing Page Design (Web Only)

**Purpose:** Marketing, conversion, download/signup. NOT a web app.

### Visual Direction
- Dark cinematic, full-width sections
- Desktop-first layout (still responsive)
- Large typography moments
- Auto-playing silent video background on hero

### Hero Section
```
Background: Looping 10s video — warm party/wedding moments, slightly slow-motion
Overlay: Dark gradient + film grain

Center:
  [Small badge: "🎞 Disposable Camera · Shared Memories"]
  
  "Everyone's perspective.
  One unforgettable album."   ← Canela display, 72px, cream
  
  "The collaborative disposable camera experience
  for your events."           ← DM Sans body, parchment

  [ Get started — it's free ]   ← Amber pill button, large
  [ See how it works ↓ ]        ← Text link, cream

Bottom of hero:
  Social proof strip: "Used at 12,000+ events worldwide" + avatar row
```

### Feature Sections (alternating left/right layout)

**Section 1 — The Camera**
```
Left: Animated phone mockup showing camera UI with shot counter
Right: 
  "Limited shots,
  limitless feeling."
  
  Body: "Give everyone a role in the story. Scarcity 
  makes every photo meaningful."
  
  Feature bullets:
  ✦ Set shot limits per guest
  ✦ Cooldown timers
  ✦ No retakes. Just moments.
```

**Section 2 — The Reveal**
```
Right: Full-width cinematic reveal animation
Left:
  "Anticipation is
  the best filter."
  
  Body: "Choose when your photos reveal — 
  instantly, after the event, or on your anniversary."
```

**Section 3 — Memory Notes**
```
Left: Phone showing a note attached to a photo
Right:
  "Photos with
  stories attached."
  
  Body: "Guests add notes, voice messages, and 
  memories to every capture. Transform photos 
  into emotional artifacts."
```

**Section 4 — The Photobook**
```
Full-width dark section
Center: Beautiful photobook mockup (warm lighting, physical book)

  "We'll turn your memories
  into a real book."
  
  "One tap. We handle the layout, printing, and delivery."
  
  [ Order a Photobook ]
```

**Section 5 — No Download Needed**
```
Background: QR code graphic
  
  "Guests join in seconds."
  
  Body: "iOS App Clip + Android web experience. 
  No download required. Scan and shoot."
  
  [iOS App Clip badge]  [Android Web badge]
```

### Pricing Section
```
Three cards:
  Free          Creator        Pro
  Personal use  Unlimited      Business features
  Basic         events         White label
  
  [Most popular: Creator — amber badge]
```

### Footer
```
Dark, minimal
Left: Logo + tagline
Center: Links (Features, Pricing, Blog, Support)
Right: App store badges

Bottom strip: "© 2026 [Brand]. Made for makers of memories."
```

---

## Component Library

### Buttons
```
Primary (Amber):
  background: var(--color-amber)
  color: #0A0806
  border-radius: var(--radius-pill)
  padding: 14px 28px
  font: Syne 600, 15px
  hover: brightness(1.08), transform: translateY(-1px)
  active: scale(0.97)

Secondary:
  background: transparent
  border: 1.5px solid var(--color-smoke)
  color: var(--color-cream)
  Same radius/padding

Ghost:
  background: transparent
  color: var(--color-amber)
  No border
  Underline on hover

Destructive:
  background: var(--color-coral)
  color: white
```

### Cards
```
Default card:
  background: var(--color-charcoal)
  border-radius: var(--radius-lg)
  border: 1px solid var(--color-smoke)
  
Elevated card:
  + box-shadow: 0 8px 32px rgba(0,0,0,0.4)

Photo card:
  overflow: hidden
  + Film grain overlay (CSS ::after pseudo-element)
  border-radius: var(--radius-md)
```

### Input Fields
```
Style: Underline-only (no box)
border-bottom: 1.5px solid var(--color-smoke)
color: var(--color-cream)
background: transparent
font: DM Sans 400, 15px

Focus state:
  border-bottom-color: var(--color-amber)
  Label float: translateY(-20px) + scale(0.8)

Error state:
  border-bottom-color: var(--color-coral)
```

### Shot Counter Component
```
Container: Amber background, full width, 40px height
Text: "XX SHOTS REMAINING" in JetBrains Mono 700, dark text
Animation: Flip transition on count change
States: amber → coral (5 shots) → red pulse (3 shots)
```

### Toast Notifications
```
Slide down from top
Dark charcoal background
Left accent bar in amber/coral/sage by type
Auto-dismiss: 3s
```

---

## Film Grain Texture

Apply as CSS overlay on photos and key screens:

```css
.film-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise SVG */
  opacity: 0.04;
  pointer-events: none;
  mix-blend-mode: overlay;
  animation: grain 0.8s steps(1) infinite;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  25%       { transform: translate(-1%, 1%); }
  50%       { transform: translate(1%, -1%); }
  75%       { transform: translate(-1%, -1%); }
}
```

---

## Accessibility

- Minimum touch target: 44x44px
- Color contrast: WCAG AA minimum (AAA for body text)
- All interactive elements have focus rings (amber outline)
- Reduced motion: Respect `prefers-reduced-motion` — disable grain animation, use simple fades
- Dynamic type: Support iOS Dynamic Type / Android font scaling
- Screen reader: All icons have `aria-label`, photos have `alt` descriptions

---

## Platform-Specific Notes

### iOS App Clip
- Max 50MB bundle size
- Minimal permissions request (camera only on first use)
- Feels like the full app (same design system)
- Deep link: `appclip.yourapp.com/join/[event-id]`

### Android Web (PWA)
- Installable via "Add to Home Screen"
- Camera access via `getUserMedia` API
- Offline: Service Worker caches event data
- Same visual design via React Native Web

---

## Design Don'ts

- ❌ No plain white backgrounds on the main app
- ❌ No purple gradients
- ❌ No generic Inter/Roboto fonts
- ❌ No flat material design buttons
- ❌ No cluttered screens — one primary action per screen
- ❌ No auto-playing sound without user initiation
- ❌ No more than 3 colors per screen
- ❌ No busy patterns behind text

---

## Summary Mood Board in Words

If you had to describe this app's visual feeling in 5 words:

**Warm. Cinematic. Intimate. Deliberate. Alive.**

It should feel like the physical weight of an old camera in your hands. Dark, warm, a little rough around the edges — but the photos it produces are pure gold.
