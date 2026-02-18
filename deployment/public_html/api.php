<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../backend/ApiRouter.php';

$limiter = new RateLimiter();
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!$limiter->check('api:' . $ip, (int) env('RATE_LIMIT_MAX', '100'), (int) env('RATE_LIMIT_WINDOW', '60'))) {
    App::json(['error' => 'Rate limit exceeded'], 429);
}

$action = $_GET['action'] ?? '';

function cmsRequireAuth(): void
{
    if (!Auth::check()) {
        App::json(['error' => 'Unauthorized'], 401);
    }
}

function cmsRequireRole(array $roles): void
{
    cmsRequireAuth();
    $role = $_SESSION['role'] ?? '';
    if (!in_array($role, $roles, true)) {
        App::json(['error' => 'Forbidden'], 403);
    }
}

function cmsRequireCsrf(array $input): void
{
    if (!Csrf::validate($input['csrf_token'] ?? null)) {
        App::json(['error' => 'Invalid CSRF token'], 422);
    }
}

function cmsSanitizeHtml(string $html): string
{
    $allowed = '<p><a><strong><em><ul><ol><li><br><h1><h2><h3><h4><blockquote><img>';
    return strip_tags($html, $allowed);
}

function cmsSlug(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    return trim($value, '-') ?: 'item-' . bin2hex(random_bytes(4));
}


if ($action === 'contact' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = App::input();

    if (!Csrf::validate($input['csrf_token'] ?? null)) {
        App::json(['success' => false, 'message' => 'Invalid CSRF token.'], 422);
    }

    $pathway = Security::sanitizeString($input['pathway'] ?? '');
    $referenceNumber = Security::sanitizeString($input['referenceNumber'] ?? '');
    $name = Security::sanitizeString($input['name'] ?? '');
    $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $company = Security::sanitizeString($input['company'] ?? '');
    $message = Security::sanitizeString($input['message'] ?? '');
    $details = $input['details'] ?? [];

    if (!in_array($pathway, ['brands', 'partners', 'direct'], true) || $referenceNumber === '' || $name === '' || !$email || $message === '') {
        App::json(['success' => false, 'message' => 'Invalid input.'], 422);
    }

    $detailLines = [];
    if (is_array($details)) {
        foreach ($details as $key => $value) {
            $detailLines[] = sprintf('%s: %s', Security::sanitizeString((string) $key), Security::sanitizeString((string) $value));
        }
    }

    $adminBody = implode('<br>', [
        '<strong>New Contact Submission</strong>',
        'Pathway: ' . $pathway,
        'Reference: ' . $referenceNumber,
        'Name: ' . $name,
        'Email: ' . $email,
        'Company: ' . ($company !== '' ? $company : 'Not specified'),
        'Message: ' . nl2br($message),
        'Details:<br>' . ($detailLines ? implode('<br>', $detailLines) : 'None'),
    ]);

    $smtp = new SMTPService();
    $smtp->send((string) env('ADMIN_EMAIL', 'admin@example.com'), 'IAEX Contact Submission ' . $referenceNumber, $adminBody);

    App::json([
        'success' => true,
        'referenceNumber' => $referenceNumber,
        'message' => "**Request Received**\nThank you {$name}. Your inquiry has been logged under reference {$referenceNumber}. Our team will respond to {$email} within one business day.",
    ]);
}


if ($action === 'public_posts') {
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int) ($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $stmt = db()->prepare('SELECT slug, title, excerpt, body, featured_image, published_at FROM posts WHERE status = :status ORDER BY COALESCE(published_at, updated_at) DESC LIMIT :limit OFFSET :offset');
    $stmt->bindValue(':status', 'published');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    App::json(['data' => $stmt->fetchAll(), 'page' => $page, 'limit' => $limit]);
}

if ($action === 'public_post') {
    $slug = Security::sanitizeString($_GET['slug'] ?? '');
    if ($slug === '') {
        App::json(['data' => null]);
    }

    $stmt = db()->prepare('SELECT slug, title, excerpt, body, featured_image, published_at FROM posts WHERE status = :status AND slug = :slug LIMIT 1');
    $stmt->execute(['status' => 'published', 'slug' => $slug]);
    App::json(['data' => $stmt->fetch() ?: null]);
}

if ($action === 'public_page') {
    $slug = Security::sanitizeString($_GET['slug'] ?? 'home');
    $stmt = db()->prepare('SELECT slug, title, body FROM pages WHERE status = :status AND slug = :slug LIMIT 1');
    $stmt->execute(['status' => 'published', 'slug' => $slug]);
    App::json(['data' => $stmt->fetch() ?: null]);
}

if ($action === 'seo_get') {
    $slug = Security::sanitizeString($_GET['slug'] ?? 'home');
    $stmt = db()->prepare('SELECT page_slug, meta_title, meta_description, canonical_url, og_title, og_description, schema_json FROM seo_settings WHERE page_slug = :slug LIMIT 1');
    $stmt->execute(['slug' => $slug]);
    App::json(['data' => $stmt->fetch() ?: null]);
}

if ($action === 'sitemap') {
    $baseUrl = rtrim((string) env('APP_URL', ''), '/');
    $urls = [];

    $pageStmt = db()->query("SELECT slug FROM pages WHERE status = 'published'");
    foreach ($pageStmt->fetchAll() as $row) {
        $slug = $row['slug'] ?? '';
        $urls[] = $baseUrl . '/#/' . ($slug === 'home' ? '' : $slug);
    }

    $postStmt = db()->query("SELECT slug FROM posts WHERE status = 'published'");
    foreach ($postStmt->fetchAll() as $row) {
        $slug = $row['slug'] ?? '';
        $urls[] = $baseUrl . '/#/insights/' . $slug;
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "
";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "
";
    foreach ($urls as $url) {
        $xml .= '  <url><loc>' . htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</loc></url>
";
    }
    $xml .= '</urlset>';

    header('Content-Type: application/xml; charset=utf-8');
    echo $xml;
    exit;
}

if ($action === 'robots') {
    header('Content-Type: text/plain; charset=utf-8');
    echo "User-agent: *
Allow: /
Sitemap: /public_html/api.php?action=sitemap
";
    exit;
if ($action === 'ai') {
    $input = App::input();
    $prompt = Security::sanitizeString($input['prompt'] ?? '');

    $manager = new AIProviderManager([
        new NullAIProvider(),
    ]);

    App::json($manager->generate($prompt));
}

if ($action === 'contact' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = App::input();
    if (!Csrf::validate($input['csrf_token'] ?? null)) {
        App::json(['error' => 'Invalid CSRF token'], 422);
    }

    $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $message = Security::sanitizeString($input['message'] ?? '');

    if (!$email || $message === '') {
        App::json(['error' => 'Invalid input'], 422);
    }

    $smtp = new SMTPService();
    $smtp->send((string) env('ADMIN_EMAIL', 'admin@example.com'), 'New Contact Request', nl2br($message));
    App::json(['success' => true]);
}

if ($action === 'csrf') {
    App::json(['token' => Csrf::token()]);
}

if ($action === 'health') {
    App::json(['status' => 'ok']);
}


if ($action === 'pages_list') {
    cmsRequireRole(['admin', 'editor']);
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int) ($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $stmt = db()->prepare('SELECT id, slug, title, status, updated_at FROM pages ORDER BY updated_at DESC LIMIT :limit OFFSET :offset');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    App::json(['data' => $stmt->fetchAll(), 'page' => $page, 'limit' => $limit]);
}

if ($action === 'page_get') {
    cmsRequireRole(['admin', 'editor']);
    $id = (int) ($_GET['id'] ?? 0);
    $slug = Security::sanitizeString($_GET['slug'] ?? '');

    if ($id > 0) {
        $stmt = db()->prepare('SELECT * FROM pages WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
    } else {
        $stmt = db()->prepare('SELECT * FROM pages WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
    }

    $row = $stmt->fetch();
    App::json(['data' => $row ?: null]);
}

if ($action === 'page_save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);

    $id = (int) ($input['id'] ?? 0);
    $title = Security::sanitizeString($input['title'] ?? '');
    $slug = cmsSlug((string) ($input['slug'] ?? $title));
    $body = cmsSanitizeHtml((string) ($input['body'] ?? ''));
    $status = in_array($input['status'] ?? 'draft', ['draft', 'published'], true) ? $input['status'] : 'draft';
    $userId = (int) ($_SESSION['user_id'] ?? 0);

    if ($title === '' || $body === '') {
        App::json(['error' => 'Title and body are required'], 422);
    }

    if ($id > 0) {
        $stmt = db()->prepare('UPDATE pages SET slug=:slug, title=:title, body=:body, status=:status, updated_by=:updated_by WHERE id=:id');
        $stmt->execute(['slug' => $slug, 'title' => $title, 'body' => $body, 'status' => $status, 'updated_by' => $userId, 'id' => $id]);
    } else {
        $stmt = db()->prepare('INSERT INTO pages (slug, title, body, status, created_by, updated_by) VALUES (:slug,:title,:body,:status,:created_by,:updated_by)');
        $stmt->execute(['slug' => $slug, 'title' => $title, 'body' => $body, 'status' => $status, 'created_by' => $userId, 'updated_by' => $userId]);
        $id = (int) db()->lastInsertId();
    }

    App::json(['success' => true, 'id' => $id, 'slug' => $slug]);
}

if ($action === 'posts_list') {
    cmsRequireRole(['admin', 'editor']);
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int) ($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $stmt = db()->prepare('SELECT id, slug, title, status, published_at, updated_at FROM posts ORDER BY updated_at DESC LIMIT :limit OFFSET :offset');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    App::json(['data' => $stmt->fetchAll(), 'page' => $page, 'limit' => $limit]);
}

if ($action === 'post_get') {
    cmsRequireRole(['admin', 'editor']);
    $id = (int) ($_GET['id'] ?? 0);
    $slug = Security::sanitizeString($_GET['slug'] ?? '');

    if ($id > 0) {
        $stmt = db()->prepare('SELECT * FROM posts WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
    } else {
        $stmt = db()->prepare('SELECT * FROM posts WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
    }

    $post = $stmt->fetch();
    if (!$post) {
        App::json(['data' => null]);
    }

    $catStmt = db()->prepare('SELECT c.id, c.name, c.slug FROM categories c INNER JOIN post_category pc ON pc.category_id = c.id WHERE pc.post_id = :post_id');
    $catStmt->execute(['post_id' => $post['id']]);
    $post['categories'] = $catStmt->fetchAll();

    App::json(['data' => $post]);
}

if ($action === 'post_save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);

    $id = (int) ($input['id'] ?? 0);
    $title = Security::sanitizeString($input['title'] ?? '');
    $slug = cmsSlug((string) ($input['slug'] ?? $title));
    $excerpt = Security::sanitizeString($input['excerpt'] ?? '');
    $body = cmsSanitizeHtml((string) ($input['body'] ?? ''));
    $featuredImage = Security::sanitizeString($input['featured_image'] ?? '');
    $status = in_array($input['status'] ?? 'draft', ['draft', 'published'], true) ? $input['status'] : 'draft';
    $publishedAt = $input['published_at'] ?? null;
    $categories = is_array($input['categories'] ?? null) ? $input['categories'] : [];
    $userId = (int) ($_SESSION['user_id'] ?? 0);

    if ($title === '' || $body === '') {
        App::json(['error' => 'Title and body are required'], 422);
    }

    if ($id > 0) {
        $stmt = db()->prepare('UPDATE posts SET slug=:slug, title=:title, excerpt=:excerpt, body=:body, featured_image=:featured_image, status=:status, published_at=:published_at, updated_by=:updated_by WHERE id=:id');
        $stmt->execute(['slug' => $slug, 'title' => $title, 'excerpt' => $excerpt, 'body' => $body, 'featured_image' => $featuredImage ?: null, 'status' => $status, 'published_at' => $publishedAt ?: null, 'updated_by' => $userId, 'id' => $id]);
    } else {
        $stmt = db()->prepare('INSERT INTO posts (slug, title, excerpt, body, featured_image, status, published_at, created_by, updated_by) VALUES (:slug,:title,:excerpt,:body,:featured_image,:status,:published_at,:created_by,:updated_by)');
        $stmt->execute(['slug' => $slug, 'title' => $title, 'excerpt' => $excerpt, 'body' => $body, 'featured_image' => $featuredImage ?: null, 'status' => $status, 'published_at' => $publishedAt ?: null, 'created_by' => $userId, 'updated_by' => $userId]);
        $id = (int) db()->lastInsertId();
    }

    $deleteStmt = db()->prepare('DELETE FROM post_category WHERE post_id = :post_id');
    $deleteStmt->execute(['post_id' => $id]);

    if ($categories) {
        $insertStmt = db()->prepare('INSERT INTO post_category (post_id, category_id) VALUES (:post_id, :category_id)');
        foreach ($categories as $categoryId) {
            $insertStmt->execute(['post_id' => $id, 'category_id' => (int) $categoryId]);
        }
    }

    App::json(['success' => true, 'id' => $id, 'slug' => $slug]);
}


if ($action === 'page_delete' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);
    $id = (int) ($input['id'] ?? 0);
    if ($id <= 0) {
        App::json(['error' => 'Invalid page id'], 422);
    }
    $stmt = db()->prepare('DELETE FROM pages WHERE id = :id');
    $stmt->execute(['id' => $id]);
    App::json(['success' => true]);
}

if ($action === 'post_delete' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);
    $id = (int) ($input['id'] ?? 0);
    if ($id <= 0) {
        App::json(['error' => 'Invalid post id'], 422);
    }
    $stmt = db()->prepare('DELETE FROM posts WHERE id = :id');
    $stmt->execute(['id' => $id]);
    App::json(['success' => true]);
}

if ($action === 'media_upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    cmsRequireCsrf($_POST);

    if (!isset($_FILES['file'])) {
        App::json(['error' => 'No file uploaded'], 422);
    }

    $file = $_FILES['file'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        App::json(['error' => 'Upload failed'], 422);
    }

    if (($file['size'] ?? 0) > 10 * 1024 * 1024) {
        App::json(['error' => 'File exceeds 10MB'], 422);
    }

    $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'pdf'];
    if (!in_array($extension, $allowed, true)) {
        App::json(['error' => 'Unsupported file type'], 422);
    }

    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0755, true);
    }

    $basename = bin2hex(random_bytes(16)) . '.' . $extension;
    $target = $uploadsDir . '/' . $basename;

    if (!move_uploaded_file((string) $file['tmp_name'], $target)) {
        App::json(['error' => 'Unable to store file'], 500);
    }

    $relativePath = '/public_html/uploads/' . $basename;
    $stmt = db()->prepare('INSERT INTO media (filename, path, mime_type) VALUES (:filename,:path,:mime_type)');
    $stmt->execute([
        'filename' => Security::sanitizeString((string) $file['name']),
        'path' => $relativePath,
        'mime_type' => Security::sanitizeString((string) ($file['type'] ?? 'application/octet-stream')),
    ]);

    App::json(['success' => true, 'url' => $relativePath]);
}

if ($action === 'media_list') {
    cmsRequireRole(['admin', 'editor']);
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int) ($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $stmt = db()->prepare('SELECT id, filename, path, mime_type, uploaded_at FROM media ORDER BY uploaded_at DESC LIMIT :limit OFFSET :offset');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    App::json(['data' => $stmt->fetchAll(), 'page' => $page, 'limit' => $limit]);
}

if ($action === 'seo_save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);

    $pageSlug = cmsSlug((string) ($input['page_slug'] ?? ''));
    $metaTitle = Security::sanitizeString($input['meta_title'] ?? '');
    $metaDescription = Security::sanitizeString($input['meta_description'] ?? '');
    $canonicalUrl = Security::sanitizeString($input['canonical_url'] ?? '');
    $ogTitle = Security::sanitizeString($input['og_title'] ?? '');
    $ogDescription = Security::sanitizeString($input['og_description'] ?? '');
    $schemaJson = (string) ($input['schema_json'] ?? '');

    if ($pageSlug === '' || $metaTitle === '') {
        App::json(['error' => 'page_slug and meta_title are required'], 422);
    }

    $stmt = db()->prepare('INSERT INTO seo_settings (page_slug, meta_title, meta_description, canonical_url, og_title, og_description, schema_json) VALUES (:page_slug,:meta_title,:meta_description,:canonical_url,:og_title,:og_description,:schema_json) ON DUPLICATE KEY UPDATE meta_title=:meta_title_u, meta_description=:meta_description_u, canonical_url=:canonical_url_u, og_title=:og_title_u, og_description=:og_description_u, schema_json=:schema_json_u');
    $stmt->execute([
        'page_slug' => $pageSlug,
        'meta_title' => $metaTitle,
        'meta_description' => $metaDescription,
        'canonical_url' => $canonicalUrl,
        'og_title' => $ogTitle,
        'og_description' => $ogDescription,
        'schema_json' => $schemaJson,
        'meta_title_u' => $metaTitle,
        'meta_description_u' => $metaDescription,
        'canonical_url_u' => $canonicalUrl,
        'og_title_u' => $ogTitle,
        'og_description_u' => $ogDescription,
        'schema_json_u' => $schemaJson,
    ]);

    App::json(['success' => true]);
}

if ($action === 'settings_get') {
    cmsRequireRole(['admin', 'editor']);
    $stmt = db()->query('SELECT `key`, `value` FROM cms_settings ORDER BY `key` ASC');
    App::json(['data' => $stmt->fetchAll()]);
}


if ($action === 'crm_leads_list') {
    cmsRequireRole(['admin', 'editor']);
    $status = Security::sanitizeString($_GET['status'] ?? '');
    $query = 'SELECT id, reference_number, pathway, name, email, company, status, assigned_to, created_at FROM leads';
    $params = [];
    if ($status !== '') {
        $query .= ' WHERE status = :status';
        $params['status'] = $status;
    }
    $query .= ' ORDER BY created_at DESC';
    $stmt = db()->prepare($query);
    $stmt->execute($params);
    App::json(['data' => $stmt->fetchAll()]);
}

if ($action === 'crm_lead_get') {
    cmsRequireRole(['admin', 'editor']);
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        App::json(['error' => 'Invalid id'], 422);
    }

    $leadStmt = db()->prepare('SELECT * FROM leads WHERE id = :id LIMIT 1');
    $leadStmt->execute(['id' => $id]);
    $lead = $leadStmt->fetch();
    if (!$lead) {
        App::json(['data' => null]);
    }

    $notesStmt = db()->prepare('SELECT ln.id, ln.note, ln.created_at, u.email AS created_by FROM lead_notes ln LEFT JOIN users u ON u.id = ln.user_id WHERE ln.lead_id = :lead_id ORDER BY ln.created_at DESC');
    $notesStmt->execute(['lead_id' => $id]);

    $activityStmt = db()->prepare('SELECT id, activity_type, activity_data, created_at FROM lead_activities WHERE lead_id = :lead_id ORDER BY created_at DESC');
    $activityStmt->execute(['lead_id' => $id]);

    App::json(['data' => $lead, 'notes' => $notesStmt->fetchAll(), 'activities' => $activityStmt->fetchAll()]);
}

if ($action === 'crm_lead_update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);

    $id = (int) ($input['id'] ?? 0);
    $status = Security::sanitizeString($input['status'] ?? 'new');
    $assignedTo = isset($input['assigned_to']) ? (int) $input['assigned_to'] : null;

    if ($id <= 0) {
        App::json(['error' => 'Invalid id'], 422);
    }

    $stmt = db()->prepare('UPDATE leads SET status = :status, assigned_to = :assigned_to WHERE id = :id');
    $stmt->execute(['status' => $status, 'assigned_to' => $assignedTo, 'id' => $id]);

    $activityStmt = db()->prepare('INSERT INTO lead_activities (lead_id, activity_type, activity_data, user_id) VALUES (:lead_id,:activity_type,:activity_data,:user_id)');
    $activityStmt->execute([
        'lead_id' => $id,
        'activity_type' => 'status_updated',
        'activity_data' => json_encode(['status' => $status, 'assigned_to' => $assignedTo]),
        'user_id' => (int) ($_SESSION['user_id'] ?? 0),
    ]);

    App::json(['success' => true]);
}

if ($action === 'crm_note_add' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin', 'editor']);
    $input = App::input();
    cmsRequireCsrf($input);

    $leadId = (int) ($input['lead_id'] ?? 0);
    $note = Security::sanitizeString($input['note'] ?? '');
    if ($leadId <= 0 || $note === '') {
        App::json(['error' => 'Invalid input'], 422);
    }

    $noteStmt = db()->prepare('INSERT INTO lead_notes (lead_id, user_id, note) VALUES (:lead_id,:user_id,:note)');
    $noteStmt->execute([
        'lead_id' => $leadId,
        'user_id' => (int) ($_SESSION['user_id'] ?? 0),
        'note' => $note,
    ]);

    $activityStmt = db()->prepare('INSERT INTO lead_activities (lead_id, activity_type, activity_data, user_id) VALUES (:lead_id,:activity_type,:activity_data,:user_id)');
    $activityStmt->execute([
        'lead_id' => $leadId,
        'activity_type' => 'note_added',
        'activity_data' => json_encode(['note' => $note]),
        'user_id' => (int) ($_SESSION['user_id'] ?? 0),
    ]);

    App::json(['success' => true]);
}

if ($action === 'crm_export_csv') {
    cmsRequireRole(['admin', 'editor']);
    $stmt = db()->query('SELECT reference_number, pathway, name, email, company, status, created_at FROM leads ORDER BY created_at DESC');
    $rows = $stmt->fetchAll();

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="leads.csv"');

    $out = fopen('php://output', 'w');
    fputcsv($out, ['reference_number', 'pathway', 'name', 'email', 'company', 'status', 'created_at']);
    foreach ($rows as $row) {
        fputcsv($out, [$row['reference_number'], $row['pathway'], $row['name'], $row['email'], $row['company'], $row['status'], $row['created_at']]);
    }
    fclose($out);
    exit;
}

if ($action === 'settings_update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    cmsRequireRole(['admin']);
    $input = App::input();
    cmsRequireCsrf($input);

    $settings = $input['settings'] ?? [];
    if (!is_array($settings)) {
        App::json(['error' => 'Invalid settings payload'], 422);
    }

    $stmt = db()->prepare('INSERT INTO cms_settings (`key`, `value`) VALUES (:k,:v) ON DUPLICATE KEY UPDATE `value`=:vu');
    foreach ($settings as $key => $value) {
        $cleanKey = Security::sanitizeString((string) $key);
        if ($cleanKey === '') {
            continue;
        }
        $cleanValue = is_array($value) ? json_encode($value) : Security::sanitizeString((string) $value);
        $stmt->execute(['k' => $cleanKey, 'v' => $cleanValue, 'vu' => $cleanValue]);
    }

    App::json(['success' => true]);
}

App::json(['error' => 'Unsupported endpoint'], 404);
