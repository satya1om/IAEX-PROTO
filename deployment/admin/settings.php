<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';
Auth::requireRole('admin');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!Csrf::validate($_POST['csrf_token'] ?? null)) {
        exit('Invalid token');
    }

    $stmt = db()->prepare('REPLACE INTO settings (`key`, `value`) VALUES (:k,:v)');
    foreach ($_POST as $k => $v) {
        if ($k === 'csrf_token') {
            continue;
        }
        $stmt->execute(['k' => $k, 'v' => Security::sanitizeString((string) $v)]);
    }

    echo 'Saved';
}
?>
<!doctype html><html><body>
<h1>Settings</h1>
<form method="post">
<input type="hidden" name="csrf_token" value="<?= Csrf::token() ?>">
<label>AI Provider Priority<input name="ai_provider_priority" value="<?= Security::sanitizeString(env('AI_PROVIDER_PRIORITY', 'null')) ?>"></label><br>
<label>SMTP Host<input name="smtp_host" value="<?= Security::sanitizeString(env('SMTP_HOST', '')) ?>"></label><br>
<button type="submit">Save</button>
</form>
</body></html>
