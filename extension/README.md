# JobTrail AI — Browser Extension

Manifest V3 extension for Chrome, Edge, Brave, Opera, and Firefox.

## Install (developer mode)

1. Download or clone this folder (`/extension`).
2. Open `chrome://extensions` (or the equivalent).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `extension` folder.

## Configure

1. Open the JobTrail AI popup by clicking the toolbar icon.
2. Enter your **API base URL** (e.g. `https://your-app.vercel.app`).
3. Paste your **API key** from `Dashboard → API Keys`.
4. Click **Save**, then **Test connection**.

## Use

Open any job application (LinkedIn, Greenhouse, Lever, Workday, Ashby, iCIMS, Taleo, custom career pages…), click the JobTrail icon, then **⚡ Autofill this page**.

- The extension scans the DOM for labels, aria-labels, placeholders, and nearby text.
- Each question is scored for confidence; only high-confidence answers (60%+) autofill.
- Green highlight = success. Pink highlight = needs manual answer.

## Firefox note

Firefox supports Manifest V3 with slight quirks — replace `chrome` with `browser` in the sources or use the `webextension-polyfill`.
