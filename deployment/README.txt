IAEX-PROTO Hostinger Deployment (3 Steps)

1) Upload the CONTENTS of this `deployment/` folder to your Hostinger domain root (usually `public_html`).
2) Create a MySQL database/user in hPanel and open `/installer.php` in your browser.
3) Complete installer form, then login at `/admin/login.php` and delete `installer.php`.

Database Setup
- Use credentials created in Hostinger hPanel.
- `database.sql` is executed automatically by installer.

SMTP Setup
- Update SMTP values in `.env` (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_ENCRYPTION`).

Cron Setup (optional)
- Add cron: `*/5 * * * * php /home/USER/public_html/cron.php`

Admin Login
- URL: `/admin/login.php`
- Use admin email/password entered during install.

Packaging
- Do not commit binary archives.
- Deploy directly from the plain-text `deployment/` folder contents.
