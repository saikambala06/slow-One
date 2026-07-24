# JobTrail AI — Browser Extension

Manifest V3 extension for Chrome, Edge, Brave, Opera, and Firefox.

**API endpoint is preconfigured** to `https://slow-one.vercel.app` — you never
need to enter or see the URL.

## Install (developer mode)

1. Download this `/extension` folder.
2. Open `chrome://extensions` (or the equivalent in your browser).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `extension` folder.

## Sign in (once)

1. Click the **JobTrail AI** icon in your toolbar → a standalone window opens.
   - Click the icon again to close it.
   - The window **stays open when you switch tabs or click on any page**.
2. Paste your **API key** from `Dashboard → API Keys` on the web app.
3. Click **Sign in**. You'll never be asked again on this device.

## Use

Open any job application (LinkedIn, Greenhouse, Lever, Workday, Ashby, iCIMS,
Taleo, custom career sites…), then in the JobTrail window click
**⚡ Autofill this page**.

- Detects labels, aria-labels, placeholders, and nearby text.
- Only autofills answers with 60%+ confidence.
- Green highlight = success. Pink = needs manual review.

## Firefox note

Firefox supports Manifest V3 with slight quirks — either replace `chrome` with
`browser` or add the `webextension-polyfill`.
