# egg-him

A one-page prank site where eggs fly in from the edges and splatter across the victim's photo. Tapping the photo throws an extra egg. Includes an egg counter and an "Email him" button powered by a Cloudflare Worker.

## Structure

```
egg-him/
├── index.html       # Single-page static app (vanilla HTML/CSS/JS)
├── photo.jpg        # Pre-cropped square photo
├── .nojekyll        # Disables Jekyll processing on GitHub Pages
├── .gitignore
├── README.md
└── worker/          # Cloudflare Worker for sending notification emails
    ├── package.json
    ├── wrangler.jsonc
    └── src/
        └── index.js
```

## Phase 1: GitHub Pages

The site is hosted on GitHub Pages from the root of the `main` branch.
- URL: `https://mmccomiskey.github.io/egg-him/`
- Built purely with vanilla HTML/CSS/JS and Web Animations API.
- All asset paths are relative (`./photo.jpg`) so it works under the `/egg-him/` subpath.
- Includes `.nojekyll` to prevent GitHub Pages from ignoring or processing internal files.

## Phase 2: Counter & Email Button

- A live egg counter in the bottom-left tracks eggs splattered.
- A floating "Email him" button appears in the bottom-right **only when** `WORKER_URL` in `index.html` is populated.
- When clicked, it sends a JSON payload `{ count: <landedCount> }` to `WORKER_URL`.
- Button states:
  - Default: `Email him`
  - Sending: `Sending...`
  - Sent: `Sent! (30s)` with a 30-second countdown cooldown preventing repeated spam.
  - Failed: `Failed to send` (re-enables after 3s).
- Security: The page never sends or exposes the recipient email address. The recipient is managed securely inside Worker secrets.

## Phase 3: Cloudflare Worker (`/worker`)

The notification backend runs on Cloudflare Workers using the Email Sending binding (`send_email`).

### Configuration & Deployment

1. **Prerequisites**:
   - Cloudflare Workers Paid plan (required for the Email Sending binding beta).
   - Sending domain registered and verified in Cloudflare Email Sending.

2. **Domain & DNS Setup**:
   - Register the sending domain (e.g. `conorsuckseggs.com`) in Cloudflare Email Sending under **Email Routing / Sending Domains**.
   - Cloudflare automatically provisions the required SPF, DKIM, and MX DNS records.
   - **Crucial**: The sending domain must be active in the same Cloudflare account where the Worker is deployed.
   - *Note on Deliverability*: Newly registered sending domains may land in spam or promotional folders initially until sender reputation builds.

3. **Environment Variables & Secrets**:
   - In `worker/wrangler.jsonc`:
     - `FROM_EMAIL`: e.g. `"eggs@conorsuckseggs.com"`
     - `ALLOWED_ORIGIN`: `"https://mmccomiskey.github.io"`
   - Add the target email secret via Wrangler:
     ```bash
     cd worker
     npx wrangler secret put TARGET_EMAIL
     ```

4. **Deploy the Worker**:
   ```bash
   cd worker
   npm install
   npx wrangler deploy
   ```

5. **Rate Limiting**:
   - In the Cloudflare Dashboard under **Security > WAF > Rate limiting rules**, add a rule matching your Worker's route (e.g., limit POST requests to max 5 per minute per IP) to prevent abuse.

6. **Connect Front-end**:
   - Update `WORKER_URL` at the top of the `<script>` tag in `index.html` with your deployed worker URL (e.g., `https://egg-him-worker.<your-subdomain>.workers.dev` or custom route).
