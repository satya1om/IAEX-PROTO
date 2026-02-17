<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IAEX-PROTO

This repository includes:
- Angular source application code.
- A Hostinger-ready deployment target under `deployment/` (Apache + PHP + MySQL).

## Local Build

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Build for production directly into `deployment/public_html`:
   `npm run build`

## Hostinger Deployment

Deploy from the `deployment/` folder contents as documented in `deployment/README.txt`.
