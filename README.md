# Valentine2 💕

Vytvoř jedinečnou valentýnku s krásnými ilustracemi a vtipnými texty. Žádné AI, jen láska a kreativita.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

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
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities (content, i18n, validation)
│   └── types/              # TypeScript types
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
