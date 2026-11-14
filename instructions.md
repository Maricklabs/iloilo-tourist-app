# Iloilo Tourist Guide: Project Instructions

> **Purpose:** This document is the central product, architecture,
> implementation, and development guide for the Iloilo Tourist Guide
> responsive web application, its administration area, the Supabase
> backend, and event-discovery automation.
>
> **Product principles:** Ilonggo-curated · Locally verified ·
> Mobile-first · Online-only · Free-tier-conscious · Privacy-conscious.

------------------------------------------------------------------------

## 1. Project Overview

Build a locally curated tourism website for visitors exploring Iloilo
City and the Province of Iloilo, Philippines. The platform combines
tourism promotion, cultural preservation, language assistance, food
discovery, navigation, local event information, and public-service
information.

The website should complement, not replace, the work of the Iloilo City
Tourism Office, Department of Tourism Region VI, local government units,
festival organizers, restaurants, cultural institutions, and other
tourism stakeholders.

### 1.1 Problems the application addresses

-   Landmark histories and visitor information are scattered and may not
    be locally verified.
-   Visitors may not understand Hiligaynon or may have difficulty
    communicating with locals.
-   Restaurant ingredient and allergen information can be difficult to
    obtain. Image-based guesses must never be treated as reliable
    allergen information.
-   Visitors want something they can open instantly on their phone
    without installing an app.
-   Local events, concerts, live bands, celebrity appearances,
    festivals, and public advisories are announced across many different
    channels.

### 1.2 Product goals

1.  Make reliable Iloilo tourism information accessible in one
    mobile-friendly website.
2.  Preserve local history, food, language, and culture.
3.  Let signed-in visitors save favorites, visited places, and trips to
    their account.
4.  Provide useful location-aware discovery and trip recording while the
    site is open.
5.  Help visitors communicate using reviewed Hiligaynon phrases and
    real-speaker audio.
6.  Make local events easier to discover while ensuring human
    verification before publication.
7.  Give authorized administrators a clear way to manage and update
    information, including uploading photos, audio, and video.
8.  Load quickly and stay usable on mid-range phones and ordinary mobile
    data connections.

### 1.3 Product constraints

-   The product is a **React website**, built mobile-first and fully
    responsive for phones, tablets, and desktops. It is not a native
    mobile app. Do not use React Native or Expo.
-   Use React with Vite and TypeScript. The tourist-facing pages and the
    admin area live in the same React application. Admin pages sit under
    `/admin` and are role-protected.
-   The product is **online-only**. Do not build offline capabilities:
    no service-worker caching, no PWA offline mode, no downloadable
    content packages, no local databases, and no background sync.
-   **Supabase is the only backend platform.** Supabase provides
    authentication, the Postgres database, file storage, server-side
    functions, and scheduled jobs.
-   **Do not use Firebase in any form.** That includes Firebase Auth,
    Firestore, Firebase Storage, Cloud Functions, Cloud Run, and Firebase
    Cloud Messaging. Nothing in this project may depend on the Firebase
    Blaze plan or any other paid plan.
-   **Do not use MongoDB.** All structured data lives in Supabase
    Postgres.
-   **All cloud file uploads (images, audio, video, documents) must use
    Supabase Storage.** Never use Firebase Storage or any other storage
    provider that requires a paid plan.
-   Cloud AI, live reviews, and live event collection require internet
    access, which is already assumed for the whole product.
-   AI-generated information must not be presented as verified fact
    without an appropriate source and review.
-   Allergen information must come from dated restaurant declarations,
    not visual recognition or AI guesses.
-   The system must retain both an Admin role and a Tourist/User role,
    with more granular admin roles where appropriate.

### 1.4 Free-tier awareness

The project is intended to run on free tiers during development and the
academic MVP. Before relying on any limit, check the current official
documentation, because plans change.

As of late 2026, the Supabase Free plan is understood to include roughly
500 MB of database storage, 1 GB of file storage, 5 GB of egress, and
auto-pausing of projects after one week of inactivity. Treat these as
design constraints:

-   Compress and resize images in the browser before upload.
-   Keep audio short and compressed. Keep video small, or embed longer
    videos from an external video platform instead of uploading them.
-   Check the current per-file upload size limit before designing video
    uploads.
-   Do not rely on paid Supabase features (for example image
    transformations) without confirming they are available on the plan in
    use.
-   Expect a free project to pause after a period of inactivity and
    plan demonstrations accordingly.
-   Keep large datasets, such as recognition training photographs,
    outside Supabase Storage.

------------------------------------------------------------------------

## 2. Proposed System Components

The system consists of one React web application and the Supabase
backend.

### A. Public Tourist Website (mobile-first, responsive)

Used by visitors to:

-   Browse landmarks, attractions, restaurants, and local dishes.
-   Use the Hiligaynon phrasebook.
-   View maps and nearby landmarks.
-   Record trips and visited places while the site is open.
-   Discover local events and festival information.
-   Save favorites.
-   Ask the tourism chatbot questions.
-   Use camera-assisted recognition as a later feature.

### B. Administrative Area (`/admin`, role-protected)

Used by authorized staff to:

-   Manage tourism content and upload media to Supabase Storage.
-   Review and publish events.
-   Manage restaurants and dated allergen declarations.
-   Manage phrasebook content and audio.
-   Manage landmarks and geofence locations.
-   Review AI-discovered event submissions.
-   Manage source accounts and feeds.
-   Review automation logs.
-   Manage users, roles, and notifications.
-   Maintain audit trails.

The admin area must also be usable on a tablet, and its core review
screens should work on a phone.

### C. Supabase Backend and Automation

Responsible for:

-   Authentication and authorization (Supabase Auth plus Row Level
    Security).
-   Data storage and querying (Postgres, with PostGIS for geographic
    queries).
-   Media storage (Supabase Storage).
-   Server-side logic (Supabase Edge Functions).
-   AI requests through server-side functions.
-   Event discovery and extraction on a schedule (Supabase Cron invoking
    Edge Functions).
-   Duplicate detection.
-   In-app notifications.
-   Recommendation logic.
-   Administrative audit logs.

### 2.1 High-level architecture

``` text
VISITORS AND ADMINS (phone, tablet, desktop browsers)
  |
  v
REACT WEB APP (React + Vite + TypeScript, responsive)
  |   public routes  +  /admin routes (role-guarded)
  |
  | supabase-js (public anon key, protected by Row Level Security)
  v
SUPABASE
  +---- Auth (email/password, Google sign-in when configured)
  +---- Postgres + PostGIS (all tourism, event, and user records)
  +---- Storage (images, audio, video, submission uploads)
  +---- Edge Functions (Gemini AI, event extraction, admin-only actions)
  +---- Cron (scheduled event discovery)
           |
           +---- Event Intelligence Service (Edge Functions)
                    |
                    +---- Authorized APIs
                    +---- RSS feeds
                    +---- Official websites
                    +---- Organizer submissions
                    +---- AI extraction and classification
                    +---- Pending event review queue

STATIC HOSTING (Netlify, Vercel, or Cloudflare Pages free tier)
  +---- serves the built React app
```

------------------------------------------------------------------------

## 3. Technology Stack

Use TypeScript throughout the application wherever practical. Before
installing a library, check current framework compatibility, maintenance
status, and licensing.

| Area | Recommended technology | Responsibility |
|------------------------|------------------------|------------------------|
| Web app | React + Vite | Single-page responsive website |
| Language | TypeScript | Type safety |
| Routing | React Router | Page navigation, guarded admin routes |
| Styling | Tailwind CSS | Responsive, mobile-first UI styling |
| Icons | lucide-react | Consistent Lucide-style icons |
| Server state | TanStack Query | Fetching and in-session caching |
| Local UI state | Zustand | UI state only |
| Forms and validation | React Hook Form + Zod | Form handling and input validation |
| Maps | Leaflet (react-leaflet) | Public and admin maps |
| Location | Browser Geolocation API | GPS position, with user permission |
| Authentication | Supabase Auth | Identity, sessions, password reset |
| Database | Supabase Postgres + PostGIS | All structured records and geo queries |
| Authorization | Row Level Security | Per-row access rules enforced in the database |
| Media storage | Supabase Storage | Images, audio, video, uploads |
| Server logic | Supabase Edge Functions | AI calls, webhooks, privileged operations |
| Scheduling | Supabase Cron | Scheduled event discovery |
| AI | Google Gemini API (via Edge Function) | Chatbot and structured extraction |
| Browser ML | TensorFlow.js | Later image recognition |
| Hosting | Netlify, Vercel, or Cloudflare Pages | Static hosting of the React build |
| Testing | Vitest + React Testing Library | Unit and component tests |

Do not add: React Native, Expo, SQLite, Firebase (any product),
MongoDB or Mongoose, Contentful, service workers for caching, or
Express/NestJS servers. Server-side logic belongs in Supabase Edge
Functions unless a requirement cannot be met there, in which case
explain the limitation and propose an alternative before implementing.

### 3.1 Supabase responsibilities

Supabase is the single owner of all data. Avoid creating competing
copies of the same content in more than one system.

**Supabase Auth**

-   User identity.
-   Email/password authentication.
-   Google sign-in when configured.
-   Password reset.
-   Session and JWT handling.

**Supabase Postgres**

-   User profiles, roles, favorites, visited places, trips, and
    preferences.
-   Landmarks, restaurants, dishes, and allergen declarations.
-   Phrasebook entries and FAQs.
-   Editorial articles and cultural content.
-   Events, event sources, and collection logs.
-   Road closures and geofence geometry.
-   Recognition metadata and recommendation rules.
-   In-app notifications.
-   Administrative records and audit logs.

**Supabase Storage**

-   Landmark, dish, restaurant, and event photographs.
-   Phrasebook audio.
-   Short videos.
-   Organizer-submitted attachments awaiting review.
-   Optional user-uploaded trip photos.

**Supabase Edge Functions**

-   Gemini chatbot and extraction calls (the API key never reaches the
    browser).
-   Event collection and normalization jobs.
-   Public submission endpoints that need rate limiting.
-   Admin-only operations that require the service role key, such as
    assigning roles.

### 3.2 Suggested Supabase tables

This is a starting point, not a final schema. Finalize it in
`docs/database-schema.md` and create it through versioned migrations in
`supabase/migrations/`.

-   `profiles`, `user_roles`
-   `landmarks`, `landmark_media`
-   `restaurants`, `dishes`, `dish_restaurants`, `allergen_declarations`
-   `phrases`
-   `articles`, `faqs`
-   `events`, `event_sources`, `collection_logs`, `event_submissions`
-   `road_closures`
-   `favorites`, `visited_places`, `trips`, `trip_points`
-   `notifications`, `notification_preferences`
-   `recommendation_rules`, `recognition_metadata`
-   `audit_logs`

Use `uuid` primary keys, `created_at` and `updated_at` timestamps, and a
`status` field (`draft`, `in_review`, `published`, `archived`) for
content that goes through review. Use PostGIS `geography` columns for
coordinates, geofence points, polygons, and route geometry.

### 3.3 Storage buckets and upload rules

All uploads go through the Supabase Storage client from the browser,
using the signed-in user's session. Do not install the Firebase SDK for
any reason.

Suggested buckets:

| Bucket | Visibility | Who can write | Contents |
|------------------------|------------------------|------------------------|------------------------|
| `landmark-media` | Public read | Admin roles only | Landmark photos and video |
| `dish-media` | Public read | Admin roles only | Dish photos |
| `restaurant-media` | Public read | Admin roles only | Restaurant photos |
| `event-media` | Public read | Admin roles only | Approved event images |
| `phrasebook-audio` | Public read | Admin roles only | Real-speaker audio |
| `submission-uploads` | Private | Public submission function | Organizer attachments pending review |
| `user-uploads` | Private | The owning user, in their own folder | Optional trip photos |

Rules:

1.  Write Storage policies for every bucket. A bucket without explicit
    policies is not acceptable.
2.  Configure each bucket with an allowed MIME-type list and a maximum
    file size.
3.  Store the object **path** in the database, not a hard-coded full URL,
    and build the URL in one centralized helper.
4.  Use a predictable folder convention, for example
    `{entity_id}/{uuid}.{ext}`. Private user files live under
    `{user_id}/`.
5.  Validate file type and size in the browser before upload, and rely on
    bucket limits as the server-side backstop.
6.  Compress and resize images in the browser before upload (for
    example, WebP at a sensible maximum dimension).
7.  Show upload progress, success, and error states. Allow replacing and
    deleting media from the admin area, and delete the Storage object
    when its database record is removed.
8.  Record who uploaded each file and when. Record the photo credit or
    permission status for landmark and dish photographs.
9.  Do not store files from untrusted public submitters in a public
    bucket. Hold them in `submission-uploads` until an administrator
    approves them.

------------------------------------------------------------------------
## 4. Branding and Design System

### 4.1 Brand identity

**Product name:** Iloilo Tourist Guide

The visual identity should feel modern, welcoming, trustworthy, locally
inspired, and appropriate for international and domestic tourists.

### 4.2 Brand colors

| Token          | Hex       | Usage                                   |
|----------------|-----------|-----------------------------------------|
| White          | `#FFFFFF` | Main surfaces                           |
| Primary Blue   | `#1769C2` | Primary buttons, navigation, links      |
| Accent Orange  | `#F28C28` | Highlights, calls to action, event accents |
| Light Blue     | `#EAF3FF` | Information cards and secondary backgrounds |
| Background     | `#F5F7FA` | Page background                         |
| Dark Navy      | `#172B45` | Dark surfaces and headings              |
| Primary Text   | `#202B3C` | Main text                               |
| Secondary Text | `#718096` | Supporting text                         |

### 4.3 Visual rules

-   Use a predominantly white interface.
-   Use blue for primary interactive elements.
-   Use orange sparingly for highlights and important actions.
-   Use light blue for information panels and secondary cards.
-   Use consistent typography, spacing, and corner radii.
-   Use rounded cards and subtle borders and shadows.
-   Use large, high-quality destination photographs, lazy-loaded and
    sized responsively.
-   Use consistent Lucide-style icons.
-   Avoid excessive gradients, unnecessary decoration, and crowded
    layouts.
-   Prioritize accessibility, readability, and touch target sizes (at
    least 44 by 44 CSS pixels for primary tap targets).
-   Design mobile-first, starting at a narrow phone width, then enhance
    for tablet and desktop breakpoints.
-   Prevent horizontal scrolling at every breakpoint.
-   Support dark mode later, without delaying the initial release.
-   Do not use random stock images as if they were verified photographs
    of Iloilo landmarks or local dishes.
-   Clearly label demonstration images and placeholder data.

Centralize design tokens in the Tailwind configuration and in reusable
components. Do not scatter hex values and spacing values throughout the
codebase.

------------------------------------------------------------------------

## 5. Recommended Repository Structure

Use a single repository containing one React application and the
Supabase project. A monorepo is no longer required.

``` text
iloilo-tourist-guide/
├── src/
│   ├── app/                 (router, providers, layouts)
│   ├── pages/
│   │   ├── home/
│   │   ├── explore/
│   │   ├── discover/
│   │   ├── landmarks/
│   │   ├── restaurants/
│   │   ├── phrasebook/
│   │   ├── events/
│   │   ├── chatbot/
│   │   ├── account/
│   │   └── admin/           (role-guarded admin pages)
│   ├── components/          (shared UI, upload components, map components)
│   ├── features/            (feature-specific logic and components)
│   ├── hooks/
│   ├── services/            (centralized Supabase data and API services)
│   ├── lib/                 (supabase client, storage helpers, utilities)
│   ├── styles/              (design tokens)
│   ├── assets/
│   └── types/
├── supabase/
│   ├── migrations/          (schema, RLS policies, storage policies)
│   ├── functions/
│   │   ├── chatbot/
│   │   ├── event-collect/
│   │   ├── event-extract/
│   │   ├── submit-event/
│   │   └── admin-users/
│   ├── seed.sql             (clearly labeled sample data)
│   └── config.toml
├── tests/
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   └── api-documentation.md
├── .env.example
├── package.json
└── README.md
```

This is the target structure, not a requirement to create empty folders
immediately. Add directories as features are implemented. Do not create
unnecessary folders or duplicate abstractions.

------------------------------------------------------------------------

## 6. Website Navigation and Pages

The site must be fully responsive.

-   **Phones:** a fixed bottom navigation bar with five primary
    destinations, a compact top bar, and a floating assistant button.
-   **Tablets and desktops:** a top navigation bar (or side navigation)
    with the same five destinations, using wider multi-column layouts.

Primary destinations:

1.  Home
2.  Explore
3.  Discover
4.  Phrasebook
5.  Events

Provide access to the account/profile and saved content. The chatbot can
be opened through a floating assistant button rather than a sixth main
navigation item. Admin pages live under `/admin` and are not shown to
tourists.

### 6.1 Home

Include:

-   Personalized welcome.
-   Destination search.
-   Featured destinations.
-   Popular landmarks.
-   Seasonal recommendations.
-   Nearby attractions (after the visitor chooses to share location).
-   Featured local dishes.
-   Upcoming events.
-   Festival highlights.
-   Quick access to the Hiligaynon phrasebook.

Use strong destination photography and concise cards.

### 6.2 Explore

Include:

-   Interactive map.
-   A "Use my location" button that requests GPS permission only when
    tapped.
-   Landmark markers.
-   Restaurant markers.
-   Tourism categories.
-   Search and filters.
-   Nearby places.
-   Landmark details.
-   Foreground geofence prompts (see section 8).
-   Visited-place history.
-   Route recording (see section 9).
-   Saved destinations.
-   Map/list toggle.
-   "Get directions" links that open an external maps application,
    instead of building turn-by-turn routing.

Suggested landmark categories:

-   Historical landmarks.
-   Churches.
-   Museums.
-   Parks and plazas.
-   Beaches and nature destinations.
-   Cultural attractions.
-   Government and heritage sites.
-   Other points of interest.

### 6.3 Discover

Include:

-   Local food dictionary.
-   Restaurant directory.
-   Camera recognition entry point (later feature, see section 12).
-   Local culture and traditions.

Dish records should include:

-   Local name.
-   English description.
-   Hiligaynon or Filipino name where applicable.
-   Meaning.
-   History and origin.
-   Typical ingredients.
-   Common allergens, where declared.
-   Restaurants serving the dish.
-   Related dishes.
-   Verified photographs.

Example dishes include La Paz Batchoy, Pancit Molo, KBL, and Pinaupong
Manok. Treat these as examples to research and validate, not as
pre-verified records.

### 6.4 Phrasebook

Categories:

-   Greetings.
-   Ordering food.
-   Asking for directions.
-   Transportation.
-   Bargaining.
-   Emergencies.
-   Medical assistance.
-   Allergies and dietary restrictions.
-   General conversations.

Each phrase should support:

-   English phrase.
-   Hiligaynon translation.
-   Filipino translation where useful.
-   Pronunciation guide.
-   Real-speaker audio, streamed from Supabase Storage.
-   Audio playback with clear loading and error states.
-   Favorites.
-   Show-to-local mode.

Show-to-local mode should display a large, readable phrase and optional
pronunciation guide.

Translations must be reviewed by native speakers or qualified local
language reviewers. Obtain consent/release forms from audio speakers.

### 6.5 Events

Include:

-   Upcoming events.
-   Events happening today.
-   This weekend.
-   Concerts.
-   Live bands.
-   Celebrity appearances.
-   Festivals.
-   Cultural events.
-   University events.
-   Food festivals.
-   Exhibitions.
-   Government activities.
-   Dinagyang activities.
-   Road closures and public advisories.

Each event should include:

-   Title.
-   Description.
-   Date and time.
-   Venue.
-   Location and coordinates when known.
-   Organizer.
-   Performers where confirmed.
-   Original announcement link.
-   Source attribution.
-   Verification status.

Only verified events appear in the public event feed. Support optional
in-app reminders and notifications (see section 18.5).

### 6.6 Account and My Iloilo

Include:

-   User profile.
-   Favorite landmarks.
-   Favorite restaurants.
-   Saved events.
-   Visited destinations.
-   Trip history.
-   Notification preferences.
-   Privacy settings.
-   Account settings.
-   Logout.

Allow guests to browse public tourism information without registering.
Require authentication only for features that genuinely need an account,
such as saving favorites and trips.

------------------------------------------------------------------------

## 7. Online-Only Architecture and Mobile Web Behavior

The product is online-only. This section replaces any offline design.

### 7.1 What is out of scope

Do not implement any of the following:

-   Service workers that cache pages, data, or media.
-   PWA offline mode or an offline fallback page.
-   Downloadable content packages.
-   IndexedDB, SQLite, or any local database for tourism content.
-   Background sync or conflict-resolution logic.
-   Offline map tiles or offline map packages.
-   Offline chatbot or offline FAQ fallbacks.

The only browser storage allowed is what `supabase-js` manages for the
auth session and small user-interface preferences such as theme or
language. Never store tourism content, tokens, or personal data in
browser storage yourself.

### 7.2 Data fetching and freshness

-   Fetch all content from Supabase through centralized service modules.
-   Use TanStack Query for in-session caching, request de-duplication,
    refetch on reconnect, and loading and error states. This is
    in-memory only and does not provide offline use.
-   Select only the columns each screen needs, and paginate lists.
-   Add database indexes for the common filters, including PostGIS
    indexes for location queries and full-text indexes for search.
-   When a request fails because of a connection problem, show a clear
    error with a retry button. Do not show stale data as if it were
    current.

### 7.3 Mobile web performance

-   Split code by route and lazy-load the admin area, maps, and any
    TensorFlow.js model.
-   Lazy-load images below the fold, set explicit image dimensions, and
    use responsive image sizes.
-   Compress images and audio before upload (see section 3.3).
-   Use skeleton loaders for lists and cards.
-   Keep the initial JavaScript bundle small and avoid heavy
    dependencies.
-   Test on a mid-range Android phone and with throttled network
    conditions in browser developer tools.
-   Test on current Chrome for Android and Safari on iOS.

### 7.4 Maps

Use Leaflet with an online tile provider.

-   Do not bulk-download tiles, and do not rely on the standard public
    OpenStreetMap tile server for production traffic. Choose a provider
    whose free tier and terms cover the intended usage, or host your own
    tiles, and verify the terms first.
-   Display the required OpenStreetMap and tile-provider attribution.
-   Do not claim turn-by-turn navigation in the app. Provide links that
    open directions in an external maps application.

### 7.5 Browser geolocation

-   Geolocation requires HTTPS and explicit user permission. Request it
    only when the visitor takes an action that needs it, and explain why.
-   Location tracking works only while the page is open and active.
    Browsers do not allow reliable background tracking for websites.
-   Accuracy varies by device and environment. Show accuracy when it is
    available.
-   Handle denied permission, unavailable position, and timeouts with
    clear messages and a manual alternative, such as browsing the list.

------------------------------------------------------------------------

## 8. Landmark and Geofence System

Each landmark record should include:

-   Unique ID.
-   Name.
-   Category.
-   Description.
-   Historical background.
-   Images (Supabase Storage paths) with photo credits.
-   Address.
-   Latitude and longitude.
-   Geofence radius.
-   Opening hours.
-   Entry fee, where applicable.
-   Source references.
-   Verification status.
-   Verified by.
-   Verification date.
-   Last updated date.

Default geofence radius should be configurable between 50 and 100
meters. Large sites such as churches, plazas, and the Esplanade may need
polygons rather than a simple circular radius. Store geofence geometry
as PostGIS `geography` values.

Requirements:

-   Geofencing on the web is **foreground only**. Detect proximity while
    the site is open and the visitor has opted in. Do not claim
    background geofencing or alerts when the site is closed.
-   Use the Geolocation API's `watchPosition`, throttled to protect
    battery, and compare positions with landmark geometry using PostGIS
    queries or a small distance utility.
-   Show geofence results as in-app prompts, for example a card or
    toast, not as operating-system notifications.
-   Prevent repeated prompts while a user remains in the same geofence.
-   Allow users to disable location-based prompts.
-   Record visited landmarks to the user's account when they are signed
    in.
-   Make location permission requests understandable and
    purpose-specific.

### Landmark dataset

Build a landmark master list containing names, categories, descriptions,
history, photographs, hours, and fees. Have the Tourism Office or other
authoritative local sources verify entries.

Collect geofence coordinates through GPS field visits and cross-check
against OpenStreetMap or authoritative geographic data.

------------------------------------------------------------------------

## 9. GPS Trip Recording

Trip recording is available to signed-in users and works **only while
the site is open and the screen is on**. Browsers pause or throttle
websites that are in the background or on a locked screen, so the
recording may have gaps.

Record route points, including:

-   Latitude.
-   Longitude.
-   Timestamp.
-   Accuracy.
-   Optional altitude.

Allow users to:

-   Start recording.
-   Pause.
-   Resume.
-   Stop.
-   View trip distance.
-   View duration.
-   Review visited locations.
-   Save a trip.
-   Display the route on the map.

Implementation notes:

-   Save route points to Supabase `trip_points` in small batches, tied to
    a `trips` record owned by the user.
-   Keep unsent points in memory only and retry on failure. If saving
    keeps failing, tell the user plainly and ask them to keep the page
    open until it succeeds. Do not build offline persistence.
-   Use the Screen Wake Lock API where the browser supports it, and
    feature-detect it.
-   Detect and mark gaps in the recording caused by the page being
    hidden.
-   Clearly communicate battery use, the need to keep the screen on, and
    location permissions.
-   Trip and location data are private to the user. Enforce this with
    Row Level Security.

------------------------------------------------------------------------

## 10. Hiligaynon Phrasebook Dataset

Create a reviewed phrase corpus organized by category.

Suggested fields:

-   `phrase_id`
-   `category`
-   `english`
-   `hiligaynon`
-   `filipino` (optional)
-   `pronunciation`
-   `audio_path` (Supabase Storage path in `phrasebook-audio`)
-   `politeness_level`
-   `is_emergency`
-   `review_status`
-   `reviewed_by`
-   `last_updated`

Build phrases for ordering, allergies, directions, bargaining,
emergencies, and general conversation.

Have native speakers or qualified local language authorities review
translations and pronunciation. Possible academic reviewers include
relevant language faculty at UP Visayas or WVSU, subject to their
availability and agreement.

Record audio consistently and obtain consent/release forms from
speakers. Compress audio before upload and keep clips short to stay
within free-tier storage.

------------------------------------------------------------------------

## 11. Food Dictionary, Restaurants, and Allergen Declarations

### 11.1 Dish records

Suggested fields:

-   Dish ID.
-   Local name.
-   Alternative names.
-   Description and meaning.
-   Origin and history.
-   Typical ingredients.
-   Recipe or preparation description, if verified.
-   Images.
-   Related dishes.
-   Restaurants serving the dish.
-   Review status.
-   Sources.
-   Last updated date.

Build the dataset with local culinary sources and tourism stakeholders
reviewing the entries.

### 11.2 Restaurant directory

Each restaurant should have:

-   Name.
-   Description.
-   Address.
-   Coordinates.
-   Operating hours.
-   Contact details.
-   Dishes served.
-   Photographs.
-   Source.
-   Verification status.
-   Last updated date.

### 11.3 Allergen declarations

Keep allergen declarations in a separate dated table
(`allergen_declarations`).

Suggested fields:

-   Restaurant ID.
-   Dish ID.
-   Declared allergens.
-   Declaration date.
-   Declaring person or source.
-   Supporting reference.
-   Last confirmed date.
-   Status.

Display wording such as:

> "Declared by the restaurant as of \[date\]."

Do not say that a dish is "safe to eat." Allergen declarations can
change and cross-contact may occur. Tell users to confirm directly with
the restaurant before ordering.

Image recognition and AI must never be used to infer or certify allergen
safety.

------------------------------------------------------------------------

## 12. Camera Recognition

Camera recognition is a later feature. Implement it in phases.

On the web, use a camera capture input or `getUserMedia` (HTTPS only)
and run an image classification model in the browser with TensorFlow.js.
Lazy-load the model so it does not slow down the rest of the site. Host
the trained model files as static assets or in a Storage bucket, and keep
the model small enough for mobile browsers.

### 12.1 Phase 1: Landmarks

Consider:

-   Camera image.
-   GPS location.
-   Known landmark coordinates.
-   Model prediction confidence.
-   Device orientation only where the browser exposes it reliably.

Requirements:

-   Collect many photographs per landmark, with varied angles, lighting,
    weather, and crowd levels.
-   Aim for a few hundred images per class where feasible.
-   Include GPS metadata where collected.
-   Split training, validation, and test data carefully.
-   Take test photographs at different times or locations to avoid
    inflated accuracy.
-   Present possible matches rather than asserting uncertain
    predictions.
-   Require user confirmation before showing a definitive match.
-   Keep raw training datasets outside Supabase Storage. Deploy only the
    trained model and its metadata.

A pretrained MobileNet or comparable lightweight model may be evaluated
for transfer learning.

### 12.2 Phase 2: Local food

Expand to approximately 20 to 30 local dish classes.

Requirements:

-   Collect several hundred varied photographs per class where feasible.
-   Obtain restaurant permission for photographs taken at
    establishments.
-   Include "other/not a dish" negative examples.
-   Use separate training, validation, and test sets.
-   Include user confirmation before displaying a result.
-   Display dictionary information and restaurant matches after
    confirmation.

Public datasets such as Food-101 are not a substitute for collecting
representative images of Ilonggo dishes.

------------------------------------------------------------------------

## 13. Trip Recommendation Engine

Begin with rule-based or content-based recommendations. Do not begin
with collaborative filtering because the application will not initially
have a large, reliable user dataset.

Implement recommendations as Postgres queries or views, or in an Edge
Function, using PostGIS for distance.

Build a place catalog with:

-   Categories.
-   Tags.
-   Coordinates.
-   Seasonality.
-   Best months.
-   Festival associations.
-   Related locations.
-   Source and verification details.

Recommendation inputs may include:

-   User interests.
-   Place categories.
-   Distance.
-   Season.
-   Festival dates.
-   Visited landmarks.
-   Saved places.
-   Available time.

Examples:

-   After a user visits Molo Church, suggest other nearby heritage
    attractions.
-   For a food-focused tourist, suggest local dishes and restaurants
    serving them.
-   As Dinagyang approaches, prioritize relevant verified festival
    information.

### Reviews and ratings

Third-party review services such as Google Places may require a billing
account and have strict terms on display, caching, and storage. Do not
adopt one unless the team has confirmed the cost and terms. The default
is an optional curated review set, maintained with appropriate
permission, in the Supabase database.

If a third-party review API is later used, do not permanently store
restricted review content, and check the attribution and map-display
rules before implementation.

------------------------------------------------------------------------
## 14. Event Intelligence and Social Media Discovery

### 14.1 Purpose

Create a separate event-discovery service, built from Supabase Edge
Functions and Supabase Cron, that finds potential local announcements and
prepares them for administrator review.

Potential event categories:

-   Live bands.
-   Concerts.
-   Music festivals.
-   Celebrity, artist, and influencer appearances.
-   University events.
-   Organization activities.
-   Dinagyang activities.
-   Food festivals.
-   Exhibitions.
-   Bazaars.
-   Mall activities.
-   Grand openings.
-   Government activities.
-   Cultural performances.
-   Nightlife and local entertainment.

The system must distinguish between an event announcement and a verified
event. Automatically discovered information is only a lead until
verified.

### 14.2 Candidate information sources

Use a hybrid source strategy.

**Facebook**

-   Official tourism and government pages.
-   Official venue and mall pages.
-   Festival organizer pages.
-   University and organization pages.
-   Event organizer pages.
-   Other public Pages where API access is permitted.

Use Meta's authorized APIs and permissions. Access to arbitrary public
Page content is not guaranteed. Review current Meta platform policies and
access requirements.

**Instagram**

-   Eligible professional accounts and authorized Graph API
    integrations.
-   Venue, organizer, artist, and tourism accounts where access is
    permitted.
-   Do not assume arbitrary personal-account posts are accessible.

**TikTok**

-   Consider only authorized API or research access that is actually
    available and permitted for the project.
-   Do not base the production pipeline on unrestricted scraping.

**Other sources**

-   Official tourism and government websites.
-   RSS feeds.
-   Local news sites.
-   Organizer-submitted forms.
-   Authorized search APIs.
-   Public event calendars where their terms allow reuse.

Possible sources to investigate include Iloilo City Government, Iloilo
City Tourism Office, DOT Region VI, Dinagyang organizers, malls such as
SM City Iloilo and Festive Walk Iloilo, universities, venues, and local
event organizers. These are candidate sources, not claims that an API
connection is already available.

Some of these APIs may have costs or approval requirements. Start with
RSS feeds, official websites, and organizer submissions, which need no
paid plan, and add other sources only after confirming access and cost.

### 14.3 Automation stack

Use Supabase Cron to invoke Edge Functions on a schedule. The Edge
Functions collect, normalize, extract, and save events. Do not make n8n a
dependency. It may be used only if the team can self-host it at no cost.

Suggested cadence: every 3 to 6 hours initially, subject to source rate
limits, Edge Function limits, Gemini quota, and API terms. Process
sources in small batches so each function run stays within execution
time limits.

### 14.4 Event discovery workflow

``` text
SUPABASE CRON TRIGGER
       |
       v
EDGE FUNCTION: COLLECT FROM CONFIGURED SOURCES
       |
       v
NORMALIZE POSTS / ARTICLES / SUBMISSIONS
       |
       v
EXTRACT EVENT INFORMATION (Gemini, server-side)
       |
       v
FILTER FOR ILOILO RELEVANCE
       |
       v
DETECT DUPLICATES
       |
       v
CLASSIFY EVENT AND ASSESS COMPLETENESS
       |
       v
SAVE AS PENDING (events.verification_status = 'pending')
       |
       v
ADMINISTRATOR REVIEWS ORIGINAL SOURCE
       |
       +---- Reject / request information
       |
       v
APPROVE AND PUBLISH
       |
       v
PUBLIC EVENT FEED / OPTIONAL IN-APP NOTIFICATION
```

### 14.5 AI extraction

Use Gemini from a Supabase Edge Function to extract structured
information from permitted source text and metadata. The Gemini API key
is stored as an Edge Function secret and never reaches the browser.

Extract:

-   Event title.
-   Category.
-   Description.
-   Start date.
-   End date.
-   Start time.
-   End time.
-   Venue.
-   Address.
-   City/municipality.
-   Coordinates, only when reliably resolved.
-   Performers.
-   Organizer.
-   Original source URL.
-   Source platform.
-   Source publication date.
-   Missing fields.
-   Extraction confidence.
-   Human-review requirement.

Example output:

``` json
{
  "title": "Live Band Night",
  "category": "live_music",
  "location": {
    "city": "Iloilo City",
    "venue": "Venue name if confirmed"
  },
  "event_date": null,
  "start_time": null,
  "performers": [],
  "description": "Extracted description",
  "source_platform": "facebook",
  "source_url": "https://example.com/original-announcement",
  "verification_status": "pending",
  "confidence": 0.0,
  "missing_fields": ["event_date", "start_time"],
  "requires_human_review": true
}
```

This is a schema example, not a real event. Never invent missing dates,
performers, venues, or coordinates. A confidence score is an AI
estimate, not proof of accuracy.

### 14.6 Event database

Suggested `events` columns:

| Column                | Description                           |
|-----------------------|---------------------------------------|
| `event_id`            | Unique identifier (uuid)              |
| `title`               | Event name                            |
| `description`         | Event details                         |
| `category`            | Concert, festival, live music, etc.   |
| `venue`               | Venue name                            |
| `address`             | Physical address                      |
| `coordinates`         | PostGIS point, if verified            |
| `start_date`          | Event start date                      |
| `end_date`            | Event end date                        |
| `start_time`          | Start time                            |
| `end_time`            | End time                              |
| `performers`          | Confirmed artists/bands               |
| `organizer`           | Event organizer                       |
| `source_platform`     | Facebook, Instagram, RSS, etc.        |
| `source_url`          | Original announcement                 |
| `source_date`         | Announcement publication date         |
| `confidence_score`    | AI extraction estimate                |
| `verification_status` | Pending, verified, rejected           |
| `verified_by`         | Admin user ID                         |
| `verified_at`         | Verification timestamp                |
| `last_updated`        | Last modification                     |

Row Level Security must ensure that anonymous and tourist users can read
only events whose `verification_status` is `verified`.

Maintain an `event_sources` table for monitored pages, accounts, RSS
feeds, websites, and other configured sources.

Maintain `collection_logs` with:

-   Source ID.
-   Collection timestamp.
-   Success or failure.
-   Items found.
-   Items rejected as irrelevant.
-   Duplicates found.
-   Error details.
-   Last successful collection.

### 14.7 Duplicate detection

Compare:

-   Normalized title.
-   Event date.
-   Venue.
-   Organizer.
-   Performer names.
-   Original source URL.

Do not merge records solely because they mention the same performer or
venue. Multiple performances may be different events.

### 14.8 Event moderation dashboard

Display:

-   Event overview.
-   Discovered events.
-   Pending verification.
-   Published events.
-   Rejected events.
-   Event sources.
-   Automation logs.
-   Manual event submission.

The review screen should show the original announcement beside the
extracted fields. On a phone, stack them vertically.

Admins must be able to:

-   Open the original source.
-   Edit extracted information.
-   Confirm date and venue.
-   Confirm performers.
-   Approve.
-   Reject.
-   Request additional information.
-   Publish.
-   Unpublish.
-   Record verification notes.

Only verified events appear in the public event feed.

### 14.9 Organizer submissions and uploads

Provide a public organizer submission form. Submissions with poster
images or attachments are uploaded through a Supabase Edge Function that
validates file type and size, applies rate limiting, and uses a CAPTCHA
to reduce abuse. Files land in the private `submission-uploads` bucket.
An administrator reviews the submission and, if approved, publishes the
approved image to `event-media`.

### 14.10 Social media and copyright safeguards

-   Do not use unauthorized browser scraping as the primary
    architecture.
-   Follow platform API permissions, rate limits, and terms.
-   Do not assume that all public posts are accessible through an API.
-   Keep the source URL and attribution.
-   Do not republish entire posters, photographs, or captions without
    appropriate permission.
-   Store only the data needed for discovery and verification.
-   Provide a manual organizer submission route.
-   Treat search snippets and AI extraction as leads, not final
    evidence.

------------------------------------------------------------------------

## 15. AI Provider and Chatbot

Use Google Gemini as the initial AI provider. Keep the AI integration
behind a Supabase Edge Function so the provider can be changed later.

Grok may be evaluated as an alternative provider, but do not make the
architecture dependent on one model's social media access or search
capabilities.

Check the current Gemini API free-tier quotas and terms before
implementation. Add per-user and per-IP rate limits and a daily cap in
the Edge Function so the quota cannot be exhausted by one visitor.

### 15.1 Appropriate AI use cases

| Feature                | Recommended method                       |
|------------------------|------------------------------------------|
| Tourist chatbot        | Gemini through an Edge Function          |
| Event extraction       | Gemini structured output                 |
| Event classification   | Gemini plus deterministic validation     |
| Landmark recognition   | Browser image model (TensorFlow.js)      |
| Food recognition       | Browser image model (TensorFlow.js)      |
| GPS landmark detection | PostGIS and distance calculations        |
| Phrasebook translations| Human-reviewed curated corpus            |
| Allergen information   | Dated restaurant declarations            |
| Recommendations        | Rule-based/content-based engine          |

### 15.2 Retrieval-Augmented Generation

Use RAG for the tourist chatbot. Start with Postgres full-text search
over approved, published content. Add vector search with pgvector later
only if full-text search is not good enough.

``` text
USER QUESTION
     |
     v
SEARCH APPROVED TOURISM CONTENT (Postgres)
     |
     v
RETRIEVE RELEVANT VERIFIED RECORDS
     |
     v
SEND QUESTION + RECORDS TO GEMINI (Edge Function)
     |
     v
GENERATE GROUNDED ANSWER
     |
     v
RETURN ANSWER WITH ENTRY REFERENCES
```

The chatbot should answer questions about:

-   Landmark histories.
-   Local dishes.
-   Hiligaynon phrases.
-   Tourist destinations.
-   Verified events.
-   Restaurant information.
-   Travel recommendations.
-   Website features.

Rules:

1.  Use retrieved verified content as the factual basis.
2.  Identify uncertainty.
3.  Do not invent tourism facts.
4.  Link to relevant pages where possible.
5.  Keep answers concise and useful.
6.  Do not invent allergen safety claims.
7.  Do not expose internal prompts, secrets, or administrative data.
8.  Respect user privacy.

If the AI service is unavailable or rate-limited, show a clear message
and offer the searchable FAQ page, which reads from the `faqs` table.
Do not pretend the chatbot works when it does not.

### 15.3 Help knowledge base

Create approximately 50 to 150 curated FAQ question-answer pairs
covering:

-   Using the phrasebook.
-   Understanding restaurant allergen declarations.
-   Saving destinations.
-   GPS and location permissions.
-   Recording trips and why the site must stay open.
-   Finding events.
-   Using recognition.
-   Account and settings help.

Include fallback responses and escalation instructions for questions
outside the website's scope.

------------------------------------------------------------------------

## 16. Content Management

The admin area is the content management system. Supabase Postgres is
the single owner of all content, and Supabase Storage is the single owner
of all media. Do not add a separate headless CMS.

### Content tables

-   Landmarks and landmark media.
-   Historical and cultural articles.
-   Dishes.
-   Phrases.
-   Tourism recommendations.
-   FAQs.
-   Restaurants.
-   Events and event sources.
-   Road closures.
-   Geofence data.
-   Recognition metadata.
-   Recommendation rules.
-   Admin audit records.

### Editorial workflow

-   Content has a `status` of `draft`, `in_review`, `published`, or
    `archived`. Public pages show only `published` content.
-   Row Level Security enforces visibility. The browser must not rely on
    client-side filtering for access control.
-   Rich text is stored as Markdown or sanitized HTML. Sanitize
    anything rendered from stored content.
-   Admin forms include media upload fields that write to the correct
    Supabase Storage bucket (see section 3.3), with preview, replace, and
    remove actions.
-   Record each important change in `audit_logs`, using database
    triggers or Edge Functions.

------------------------------------------------------------------------

## 17. Admin Roles and Permissions

Suggested roles:

| Role               | Permissions                                      |
|--------------------|--------------------------------------------------|
| `super_admin`      | Full system management                           |
| `tourism_admin`    | Landmarks and tourism content                    |
| `event_admin`      | Event review and publishing                      |
| `restaurant_admin` | Restaurant records and declarations              |
| `content_editor`   | Articles, translations, descriptions             |
| `tourist`          | Public browsing and personal account features    |

Store roles in a `user_roles` table. Enforce roles in the database with
Row Level Security policies and Storage policies, using a
security-definer helper such as `has_role(role)`. Hiding frontend
controls is not enough. Guard `/admin` routes in the client as well, for
a better user experience.

Role assignment and any action that needs the service role key must run
in an Edge Function that first verifies the caller is a `super_admin`.
Never expose the service role key to the browser.

The admin dashboard should include:

1.  Overview.
2.  Landmarks.
3.  Restaurants.
4.  Dishes.
5.  Phrasebook.
6.  Events.
7.  Event Discovery.
8.  Event Sources.
9.  Road Closures.
10. User Management.
11. Content Management and Media Library.
12. Notifications.
13. Automation Logs.
14. Settings.

Overview metrics:

-   Total landmarks.
-   Total restaurants.
-   Published events.
-   Pending event approvals.
-   Registered users and recent sign-ins.
-   Popular destinations.
-   Recent administrative activity.
-   Storage usage, so the team can stay within free-tier limits.

Include audit logs for important administrative actions.

------------------------------------------------------------------------

## 18. Events, Dinagyang, Road Closures, and Notifications

### 18.1 Event calendar dataset

Fields:

-   Title.
-   Description.
-   Start and end dates.
-   Start and end times.
-   Venue.
-   Coordinates.
-   Organizer.
-   Source link.
-   Verification status.

Sources should include the Tourism Office, DOT Region VI, event
organizers, and Dinagyang organizers, subject to confirmation and
permission.

### 18.2 Dinagyang-specific data

Potential records:

-   Parade schedules.
-   Parade routes as geographic geometry (PostGIS).
-   Tribes.
-   Performance schedules.
-   Viewing areas.
-   Official event venues.
-   Official advisories.

Do not populate these with invented schedules or routes.

### 18.3 Road and area closures

Store:

-   Affected roads or geographic geometry.
-   Start and end time windows.
-   Official advisory.
-   Issuing authority.
-   Source URL.
-   Last verified timestamp.
-   Alternative route information, if officially supported.

Road closures require an explicit manual admin update process using
official LGU or traffic-management sources. Stale closure notices must
not remain presented as current. Hide or flag closures whose time window
has ended or whose last verified timestamp is too old.

### 18.4 Transport guidance

Where reliable information is available, include:

-   Alternative routes.
-   Jeepney and terminal changes.
-   Parking areas.
-   Temporary transport advisories.

### 18.5 Notifications

Start with an in-app notification center backed by the `notifications`
table. Support:

-   Event reminders shown in the notification center.
-   Event-to-geofence mapping for foreground prompts.
-   User-selected topic or area subscriptions.
-   Road closure alerts shown prominently on the site.
-   Optional nearby-event prompts while the site is open.

Browser push notifications and email are optional later additions. Web
Push needs a service worker used only to receive pushes, not to cache
content, and support differs by browser and platform, including on iOS.
Email needs a mail provider and has its own free-tier limits. Verify both
before committing to them, and do not introduce Firebase Cloud Messaging.

Respect notification preferences and avoid excessive alerts.

------------------------------------------------------------------------
## 19. Data Sources and Dataset Collection Plan

### 19.1 Content and location

**Landmark master list**

-   Name.
-   Category.
-   Description.
-   History.
-   Photos.
-   Opening hours.
-   Entry fees.
-   Sources.
-   Verification status.

Build the list and have the Tourism Office or relevant authoritative
sources verify it.

**Geofence data**

-   Latitude and longitude.
-   Radius between 50 and 100 meters where appropriate.
-   Polygon geometry for large sites.

Collect coordinates during field visits and cross-check against
OpenStreetMap or authoritative geographic datasets.

**Map data**

-   Iloilo City and selected areas of Iloilo Province.
-   Online tile provider or self-hosted tiles. Confirm data licensing,
    tile-provider terms, and attribution.

**Road network and points of interest**

-   OpenStreetMap or authoritative PSA/NAMRIA boundary data, subject to
    applicable licenses and availability.

**User-generated data**

-   Places-visited logs.
-   Timestamped GPS route points.
-   Saved to the user's Supabase account while the site is open.

### 19.2 Phrasebook

Build a phrase corpus and have it reviewed by local speakers or
qualified language reviewers.

Collect:

-   Phrase text.
-   Translation.
-   Pronunciation.
-   Audio (uploaded to Supabase Storage).
-   Category.
-   Politeness level.
-   Emergency flag.
-   Reviewer and review date.
-   Speaker consent.

### 19.3 Food and place dictionary

Build:

-   Dish records.
-   Dish histories.
-   Ingredient records.
-   Restaurant directory.
-   Restaurant-to-dish relationships.
-   Separate dated allergen declarations.

Work with local culinary sources and establishments.

### 19.4 Recognition training data

Landmarks:

-   Varied photographs.
-   Different angles.
-   Lighting.
-   Weather.
-   Crowd levels.
-   GPS metadata where available.

Dishes:

-   Approximately 20 to 30 initial classes.
-   Several hundred images per class where feasible.
-   Other/not-a-dish negative examples.
-   Restaurant permissions.
-   Independent test photographs.

Use train/validation/test splits that avoid near-duplicate images
leaking between sets. Store raw training images outside Supabase Storage
to protect the free-tier storage allowance.

### 19.5 Recommendation data

Build:

-   Place catalog.
-   Categories and tags.
-   Seasonal rankings.
-   Festival associations.
-   Place-to-place relatedness.
-   Nearby-place relationships.
-   Optional user interest tags and visit history.

Start with distance and tags. Do not require collaborative filtering.

### 19.6 Events data

Collect:

-   Event calendar.
-   Dinagyang schedules.
-   Parade routes.
-   Performer schedules.
-   Official closure advisories.
-   Transport guidance.
-   Event subscriptions.
-   Event-to-geofence relationships.

### 19.7 Chatbot data

Build:

-   Curated help knowledge base.
-   Intent examples where needed.
-   English, Filipino, and Hiligaynon phrasing variations where
    reviewed.
-   Fallback content.
-   Escalation instructions.

------------------------------------------------------------------------

## 20. Security, Privacy, and Reliability

Implement:

-   Row Level Security enabled on every table in the public schema, with
    explicit policies. No table is left open by default.
-   Storage policies on every bucket (see section 3.3).
-   Supabase JWT verification in every Edge Function that needs a signed-in
    user.
-   Server-side role-based authorization through RLS and Edge Functions.
-   Input validation with Zod on the client and in Edge Functions.
-   Rate limiting and CAPTCHA on public submission and chatbot endpoints.
-   Secure error handling that does not leak internals.
-   Environment variables and secret management.
-   Protected admin routes.
-   Audit logs.
-   Appropriate location permissions.
-   User consent for GPS tracking.
-   Secure handling of the Gemini API key.
-   Sanitization of any user-supplied or stored rich text before
    rendering.
-   Data minimization and appropriate retention rules, including a way
    for users to delete their trips and location history.

Key handling:

-   The Supabase **anon key** and project URL may appear in the browser
    bundle. They are protected by Row Level Security.
-   The Supabase **service role key**, the Gemini API key, and any
    third-party API secrets belong only in Edge Function secrets. Never
    prefix a secret with `VITE_`, because Vite exposes every `VITE_`
    variable to the browser.

Never commit secrets to source control. Provide `.env.example` with
variable names only, for example `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`.

Do not expose private user information through public endpoints.

Use least-privilege access for external APIs.

Provide meaningful loading, empty, error, and retry states.

------------------------------------------------------------------------

## 21. Development Roadmap

Build incrementally. Do not attempt to implement the entire product in
one Copilot task.

### Milestone 1: Foundation

-   Inspect existing repository.
-   Set up the Vite React TypeScript app.
-   Set up routing, Tailwind CSS, and the responsive layout shell.
-   Establish the design system.
-   Set up the Supabase project configuration and the Supabase client.
-   Create the initial database migration with core tables and RLS.
-   Implement authentication and role-based authorization.
-   Create the admin area shell.

### Milestone 2: Tourism Content

-   Home page.
-   Landmark directory and details.
-   Food dictionary.
-   Phrasebook.
-   Favorites.
-   Admin CRUD interfaces.

### Milestone 3: Media, Uploads, and Performance

-   Supabase Storage buckets and Storage policies.
-   Reusable upload component with validation, client-side compression,
    progress, replace, and delete.
-   Admin media library.
-   Photo credit and permission tracking.
-   Phrasebook audio upload and playback.
-   Lazy loading, responsive images, and a performance pass on mobile.

### Milestone 4: Mapping

-   Leaflet map with an online tile provider.
-   Landmark markers.
-   Browser geolocation and permission handling.
-   Nearby places using PostGIS.
-   Foreground geofence prompts.
-   GPS route recording while the site is open.

### Milestone 5: Events

-   Event database.
-   Event calendar.
-   Admin event management.
-   Event source management.
-   Supabase Cron and Edge Function collection.
-   RSS collection workflow.
-   AI extraction.
-   Duplicate detection.
-   Human verification.
-   Organizer submission form with upload.
-   In-app notifications.

### Milestone 6: AI

-   Gemini integration through Edge Functions.
-   Tourism chatbot.
-   Retrieval system.
-   FAQ page and error fallback.
-   Event extraction integration.

### Milestone 7: Recognition

-   Landmark image dataset.
-   Browser-based landmark classification with TensorFlow.js.
-   GPS-assisted recognition.
-   Food image dataset.
-   Food recognition.
-   User confirmation.

### Milestone 8: Festival Mode and Finalization

-   Dinagyang schedules.
-   Verified performance locations.
-   Official road closures.
-   Alternative route information.
-   Festival notifications.
-   Testing.
-   Performance optimization.
-   Security testing, including RLS and Storage policy tests.
-   Responsive testing on Chrome for Android, Safari on iOS, and
    desktop browsers.
-   Documentation.
-   Deployment to static hosting.

------------------------------------------------------------------------

## 22. MVP Scope and Feature Priorities

### P0: First usable release

| Feature            | Initial scope                                  |
|--------------------|------------------------------------------------|
| Authentication     | Basic Supabase Auth                            |
| Home               | Featured destinations and events               |
| Landmark directory | Searchable verified records                    |
| Media              | Admin image upload to Supabase Storage         |
| Phrasebook         | Reviewed phrases and audio                     |
| Food dictionary    | Dish descriptions and restaurant references    |
| Favorites          | Save destinations                              |
| Admin area         | Manage core content                            |
| Events             | Manually submitted and verified events         |
| Responsiveness     | Works on phones, tablets, and desktops         |

### P1: Expanded release

-   Interactive map.
-   Foreground geofence prompts.
-   GPS trip history.
-   Event discovery automation.
-   AI chatbot.
-   Seasonal recommendations.
-   Restaurant partnerships.
-   In-app notifications.

### P2: Advanced release

-   Landmark image recognition.
-   Food recognition.
-   Larger restaurant dataset.
-   Dinagyang festival mode.
-   Road closure geometry.
-   Optional browser push or email notifications.

Do not let high-risk features delay a working, responsive tourism MVP.

------------------------------------------------------------------------

## 23. Coding Standards and Copilot Rules

Follow these rules strictly:

1.  Use TypeScript throughout.
2.  Use reusable components.
3.  Keep components modular.
4.  Separate business logic from UI.
5.  Use centralized service modules for all Supabase access.
6.  Use environment variables for configuration.
7.  Never hardcode credentials.
8.  Avoid unnecessary dependencies.
9.  Avoid duplicate components.
10. Use clear file and folder names.
11. Implement loading, error, empty, and retry states.
12. Validate forms and API inputs.
13. Use consistent response formats from Edge Functions.
14. Handle errors deliberately.
15. Keep code understandable and maintainable.
16. Do not create fake working functionality.
17. Do not claim an integration is complete when credentials or external
    services are missing.
18. Clearly identify mock data.
19. Add tests for important business logic.
20. Do not replace working code unnecessarily.
21. Check library compatibility before installing dependencies.
22. Document required environment variables and external setup.
23. Do not put privileged API keys, including the Supabase service role
    key, in the web bundle.
24. Do not invent official tourism records, schedules, routes, reviews,
    or declarations.
25. Keep accessibility and responsive behavior in scope from the
    beginning.
26. Enable Row Level Security on every table and write Storage policies
    for every bucket, in versioned migrations.
27. Use Supabase Storage for every upload. Do not add Firebase, MongoDB,
    React Native, Expo, service workers, or any offline storage, and do
    not add any dependency that requires a paid plan.

When implementing a feature:

-   Explain which files will be created or modified.
-   Identify required dependencies.
-   Implement the complete scoped feature.
-   Explain how to run it.
-   Explain how to test it.
-   Identify credentials or external configuration required.
-   Include tests where appropriate.
-   Update relevant documentation.

If a requirement is incompatible with the selected framework or
platform, explain the issue and propose a realistic alternative before
implementation.

------------------------------------------------------------------------

## 24. Initial GitHub Copilot Task

Use GitHub Copilot Chat in Agent mode with this instruction document as
the project specification.

**Do not implement every feature immediately.**

First:

1.  Inspect the existing repository.
2.  Determine whether an application already exists.
3.  Report the current project structure.
4.  Identify existing dependencies and configurations.
5.  Identify code that should be preserved.
6.  Propose the final architecture.
7.  Identify framework compatibility issues.
8.  Prepare a phased implementation plan.
9.  Identify missing external credentials and services.

After inspection, implement **Milestone 1 only**.

Initial deliverables:

-   Working React + Vite + TypeScript web application.
-   Shared branding system and design tokens.
-   Responsive navigation: bottom bar on phones, top navigation on larger
    screens.
-   Functional home page.
-   Placeholder pages for the other destinations.
-   Role-guarded `/admin` area with a sidebar that collapses on small
    screens, and a dashboard overview.
-   Supabase client configuration and placeholders.
-   Initial Supabase migration with core tables, RLS policies, and
    storage bucket definitions.
-   README setup instructions.
-   `.env.example` without real secrets.

Use realistic Iloilo demonstration data, clearly labeled as sample data
until verified.

Do not fabricate official tourism information.

The goal is a clean, scalable, working foundation that can be expanded
feature by feature.

------------------------------------------------------------------------

## 25. Additional Task Prompts

Use these as separate Copilot tasks after the initial foundation is
stable.

### A. Responsive UI/UX

> Using this project's architecture and design system, implement the
> Home, Explore, Discover, Phrasebook, and Events pages. Use React, Vite,
> TypeScript, and Tailwind CSS. Follow the white, blue (`#1769C2`), and
> orange (`#F28C28`) branding. Design mobile-first, then adapt for tablet
> and desktop. Create a polished tourism-oriented interface with reusable
> components, functional navigation, search, category filters,
> destination cards, event cards, and proper loading, empty, and error
> states. Use clearly labeled demonstration data. Do not add offline
> support or service workers.

### B. Event Automation

> Develop the Iloilo Tourist Guide Event Intelligence System using
> Supabase Postgres, Supabase Edge Functions, Supabase Cron, and Gemini.
> Discover potential events through authorized public sources, official
> websites, RSS, permitted Facebook Page API access, eligible Instagram
> professional account integrations, and organizer submissions. Extract
> title, category, date, time, venue, performers, organizer, description,
> source URL, and publication date. Implement location relevance
> filtering, duplicate detection, source preservation, pending status,
> admin review, publication, logs, and error handling. Never invent
> missing information or publish unverified events. Do not use
> unauthorized social media scraping. Start with the schema, RLS
> policies, one Edge Function, and one working RSS-based collection
> workflow.

### C. Media Uploads and Storage

> Implement media uploads using Supabase Storage only. Create the
> buckets and Storage policies described in this project's instructions,
> a reusable upload component with file type and size validation,
> client-side image compression, upload progress, error handling, replace
> and delete actions, and an admin media library. Support landmark
> photos, dish photos, restaurant photos, phrasebook audio, event images,
> and short videos. Store object paths in the database and build URLs
> through one helper. Do not use Firebase Storage or any paid service.
> Include tests for the validation logic and document the required
> Supabase setup.

------------------------------------------------------------------------

## 26. Validation, Interviews, and Stakeholder Engagement

The technical plan is not a substitute for local research.

Conduct interviews and collect suggestions from:

-   Iloilo City Tourism Office.
-   DOT Region VI.
-   Dinagyang organizers.
-   Local event organizers.
-   Restaurant owners and staff.
-   Local residents.
-   Native Hiligaynon speakers.
-   Tourists and visitors.
-   Relevant academic and cultural experts.

Use interviews to validate:

-   Which landmarks should be prioritized.
-   Which histories and descriptions are accurate.
-   Which phrases tourists actually need.
-   Which local dishes should be included.
-   Which restaurant information can be shared.
-   How allergen declarations should be collected and updated.
-   Which events and advisories are useful.
-   Which map areas and categories matter most.
-   Whether the proposed workflow is practical for administrators.

Do not assume every proposed feature will be accepted unchanged.
Document feedback, prioritize essential changes, and avoid scope
expansion without a clear reason.

### Proposed sponsor engagement

Potential stakeholders and sponsors:

-   Iloilo City Tourism Office.
-   Department of Tourism Region VI.
-   Festival organizers.
-   Local establishments and restaurants.
-   Relevant universities and cultural institutions.

The first engagement should present the concept and request validation
of content accuracy, official event sources, restaurant partnerships,
and the proposed administrative process.

------------------------------------------------------------------------

## 27. Final Product Principles

Every development decision should support these principles:

1.  **Ilonggo-curated:** Local information should be reviewed by people
    with appropriate local knowledge.
2.  **Mobile-first web:** The experience is designed for phones first and
    works well on tablets and desktops.
3.  **Locally verified:** Important facts, events, routes, opening
    hours, and declarations must have traceable sources and review
    status.
4.  **Human-reviewed:** AI-discovered events and uncertain recognition
    results require confirmation.
5.  **Privacy-conscious:** Location and account data must be handled with
    consent and appropriate safeguards.
6.  **Free-tier-conscious:** The MVP runs on Supabase and free hosting,
    with no dependence on Firebase Blaze or any paid plan. Uploads use
    Supabase Storage and respect its limits.
7.  **Incremental:** Deliver a usable MVP before implementing advanced AI
    and recognition features.
8.  **Maintainable:** Keep data ownership, backend responsibilities, and
    access rules clear. Supabase owns all data and media.
9.  **Accessible:** Make the website understandable and usable for
    visitors with different levels of technical and language
    familiarity.
10. **Trustworthy:** Never present an AI guess, stale advisory, or
    unverified social post as confirmed information.

**The defining identity of Iloilo Tourist Guide is: an Ilonggo-curated,
locally verified, mobile-friendly web companion for discovering
Iloilo.**
