# Valentine2 💕

Vytvoř jedinečnou valentýnku s krásnými ilustracemi a vtipnými texty. Žádné AI, jen láska a kreativita.

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables (see below)
cp env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Setup (EPIC 2 - Database)

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Copy environment template:**
   ```bash
   cp env.example .env.local
   ```

3. **Fill in your Supabase credentials** in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   CLEANUP_SECRET=your-random-secret
   ADMIN_SECRET=your-admin-secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run database migration:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run

5. **Verify setup:**
   ```bash
   npm run dev
   curl http://localhost:3000/api/health
   # Should return: {"status":"ok","database":"connected","tablesExist":true}
   ```

## API Endpoints (EPIC 2)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Database health check |
| `/api/cards` | POST | Create new card + order |
| `/api/cards/[token]` | GET | Fetch card by public token |
| `/api/cleanup` | POST/GET | Delete expired cards (cron) |
| `/api/admin/block-card` | POST | Block/unblock card (admin) |

### Creating a Card

```bash
curl -X POST http://localhost:3000/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "hearts-classic",
    "tone": "funny", 
    "messageText": "Jsi super!",
    "toName": "Jan",
    "fromName": "Terka"
  }'
# Returns: {"token":"abc123","publicUrl":"/c/abc123","orderId":"..."}
```

### Public Card URL

Cards are accessible at `/c/[token]` - share this URL with the recipient!

## Project Structure

```
valentine2/
├── content/
│   ├── texts/texts.json    # Text entries by tone
│   ├── templates.json      # Template definitions
│   ├── copy.cs.json        # UI strings (Czech)
│   └── blocklist.json      # Content moderation
├── public/
│   └── illustrations/      # SVG card illustrations
├── src/
│   ├── app/
│   │   ├── api/            # API routes (cards, health, cleanup, admin)
│   │   ├── c/[token]/      # Public card page
│   │   ├── create/         # Card creation page
│   │   └── preview/        # Preview page (legacy)
│   ├── components/         # React components
│   ├── lib/                # Utilities (supabase, token, validation)
│   └── types/              # TypeScript types (content, database)
├── supabase/
│   └── migrations/         # SQL migrations
├── env.example             # Environment template
├── vercel.json             # Vercel cron config
└── vitest.config.ts        # Test configuration
```

## Features (EPIC 1 - MVP)

- [x] Landing page with value proposition
- [x] Template gallery with 3 illustrations
- [x] Generator form (template, names, tone, keywords)
- [x] Text selector engine with scoring
- [x] Card preview with reveal animation
- [x] URL-based data transfer
- [x] Input validation + content safety
- [x] Keyboard accessible components
- [x] Czech UI copy

## Features (EPIC 2 - Database & Sharing)

- [x] Supabase Postgres integration
- [x] Persistent card storage with public tokens
- [x] Shareable public URLs (`/c/[token]`)
- [x] View tracking (opened events)
- [x] 30-day auto-expiry (GDPR compliant)
- [x] Admin block/unblock endpoint
- [x] Cleanup cron job for expired cards
- [x] Health check API

## QA Smoke Test Checklist

Before release, manually verify:

### Happy Path
- [ ] Landing page loads → click "Vytvořit kartu"
- [ ] /create page → select template → fill form → click "Vygenerovat text"
- [ ] Text appears → click "Zkusit jiný text" → different text appears
- [ ] Click "Pokračovat na náhled" → /preview shows card
- [ ] Refresh /preview → card still visible (URL params preserved)

### Edge Cases
- [ ] Anonymous toggle → hides "Od koho" field, shows "Anonym" on card
- [ ] Long text (>140 chars in keywords) → shows char counter, prevents overflow
- [ ] Blocked content → shows "Text obsahuje nevhodný obsah" error
- [ ] Missing template → shows "Vyber šablonu" error
- [ ] Direct /preview access without params → redirects to /create

### Accessibility
- [ ] Template gallery → keyboard navigation (arrow keys, Enter to select)
- [ ] Form fields → proper labels and focus states
- [ ] Error messages → visible and descriptive

### Responsive
- [ ] Mobile (375px) → single column layout, readable text
- [ ] Tablet (768px) → 2-3 column grids
- [ ] Desktop (1024px+) → full layout

## Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test -- --coverage
```

Current test coverage:
- `textSelector.ts` - 6 tests (tone filter, tag match, keyword scoring, fallback, reshuffle)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Testing:** Vitest
- **Fonts:** Nunito + Caveat (Google Fonts)

## Content Customization

### Adding Templates
Edit `content/templates.json` and add SVG to `public/illustrations/`.

### Adding Texts
Edit `content/texts/texts.json`. Each entry needs:
- `id` - unique identifier
- `tone` - cute | funny | spicy | sarcastic
- `tags` - array of keywords for matching
- `text` - the actual message

### Moderation
Edit `content/blocklist.json` to add blocked words/patterns.

---

Made with ❤️ in Prague
