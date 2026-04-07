# Nokturnal Lifestyle — Next.js Site

A fully SEO-optimized, conversion-focused Next.js 14 site for Nokturnal Lifestyle Concierge Las Vegas.

## 🚀 Deploy to Vercel (Free — Recommended)

### Step 1: Push to GitHub
1. Create a free account at [github.com](https://github.com)
2. Create a new repository called `nokturnal-lifestyle`
3. Upload all these files to the repo (drag & drop in GitHub UI, or use git)

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **"Add New Project"** → select your `nokturnal-lifestyle` repo
3. Click **Deploy** — it will auto-detect Next.js settings
4. Your site is live at a `.vercel.app` URL in ~2 minutes

### Step 3: Connect Your Domain
1. In Vercel → Project → Settings → Domains
2. Add `nokturnallifestyle.com` and `www.nokturnallifestyle.com`
3. Vercel gives you DNS records — update them in your domain registrar (GoDaddy, Namecheap, etc.)
4. SSL is automatic and free

**Total cost: $0/month** (Vercel free tier is plenty for this traffic level)

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Open http://localhost:3000
```

---

## 📁 File Structure

```
nokturnal-lifestyle/
├── app/
│   ├── layout.tsx          ← Root layout (SEO, schema, fonts)
│   ├── page.tsx            ← Homepage (main conversion page)
│   ├── globals.css         ← Design system & styles
│   ├── sitemap.ts          ← Auto-generated sitemap
│   ├── robots.ts           ← Robots.txt
│   ├── bachelor/page.tsx   ← Bachelor party page
│   ├── bachelorette/page.tsx
│   ├── bottle-service/page.tsx
│   ├── nightclubs/page.tsx
│   ├── pool-parties/page.tsx
│   ├── strip-clubs/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── Navbar.tsx          ← Sticky nav with dropdown menus
│   ├── Footer.tsx          ← Full footer with links
│   ├── FloatingCTA.tsx     ← Phone + WhatsApp floating buttons
│   ├── PackageCard.tsx     ← Reusable package card
│   ├── ReviewCard.tsx      ← Review card
│   └── InquiryForm.tsx     ← Lead capture form
└── public/
    └── (add your images here)
```

---

## 📸 Images — Replace With Your Own

The site currently uses Unsplash placeholder images. Replace with your actual photos:
- Add photos to `/public/` folder
- Replace `https://images.unsplash.com/...` URLs with `/your-photo.jpg`
- Recommended: 1 hero photo per page (1600×900 min), package card photos (600×400)

**Pro tip**: Use your real event photos — authentic photos convert significantly better than stock.

---

## 📬 Connect a Real Form Handler

The inquiry form currently simulates a submission. To make it actually send you leads:

### Option A: Formspree (Free, easy)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form → get your endpoint URL
3. In `components/InquiryForm.tsx`, replace the `await new Promise(...)` line with:
```js
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
})
```

### Option B: Send email directly via Resend
1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Create an API Route at `app/api/contact/route.ts`
3. Wire the form to post to `/api/contact`

---

## 🔍 SEO Features Built In

- ✅ Unique title + meta description per page
- ✅ Open Graph tags for social sharing
- ✅ Schema.org LocalBusiness markup with reviews
- ✅ Canonical URLs
- ✅ Auto-generated sitemap.xml at `/sitemap.xml`
- ✅ Robots.txt at `/robots.txt`
- ✅ Semantic HTML (H1 → H2 → H3 hierarchy)
- ✅ Alt text on all images
- ✅ Next.js Image optimization (lazy loading, WebP)
- ✅ Core Web Vitals optimized (static pages, no WP bloat)
- ✅ Google Fonts loaded via next/font (zero layout shift)

---

## 📊 After Launch: Measure & Improve

1. **Google Search Console** — submit your sitemap, track keyword rankings
2. **Google Analytics 4** — add your GA4 measurement ID to `app/layout.tsx`
3. **Google Business Profile** — update your website URL to the new site
4. **Yelp** — update your website link

### Add Google Analytics:
In `app/layout.tsx`, add inside `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script dangerouslySetInnerHTML={{ __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
` }} />
```

---

## 🎯 SEO Keyword Targets Per Page

| Page | Primary Keywords |
|------|-----------------|
| Homepage | "Las Vegas VIP concierge", "Las Vegas bachelor party" |
| Bachelor | "Las Vegas bachelor party packages", "Las Vegas bachelor party ideas" |
| Bachelorette | "Las Vegas bachelorette party packages", "Las Vegas bachelorette ideas" |
| Bottle Service | "Las Vegas bottle service", "Las Vegas VIP table reservation" |
| Nightclubs | "Las Vegas nightclubs", "XS nightclub table", "Hakkasan VIP" |
| Pool Parties | "Las Vegas pool party", "Encore Beach Club cabana", "dayclub Vegas" |
| Strip Clubs | "Las Vegas strip club packages", "Crazy Horse 3 VIP" |

---

## 💡 Next Steps (Phase 2)

1. **Blog** — Start posting 1 article/week targeting local keywords
   - "Best Las Vegas nightclubs 2026"
   - "How much does bottle service cost in Las Vegas"
   - "XS vs Hakkasan: Which nightclub is right for you?"
   
2. **Online Booking** — Integrate Calendly or a booking tool so customers can self-serve

3. **Live Chat** — Add Tawk.to or Intercom (free tier available)

4. **Video** — Add a short walkthrough video to the homepage hero

---

Built with ❤️ using Next.js 14 + Tailwind CSS. Deployed on Vercel.
