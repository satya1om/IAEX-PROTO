<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';

$limiter = new RateLimiter();
$key = 'login:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!$limiter->check($key, (int) env('BRUTE_FORCE_MAX_ATTEMPTS', '5'), (int) env('BRUTE_FORCE_LOCKOUT', '900'))) {
    http_response_code(429);
    exit('Too many login attempts');
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!Csrf::validate($_POST['csrf_token'] ?? null)) {
        $error = 'Invalid request token.';
    } else {
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = (string) ($_POST['password'] ?? '');

        if ($email && Auth::login((string) $email, $password)) {
            header('Location: index.php');
            exit;
        }

        $error = 'Invalid credentials';
    }
}
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Login</title></head>
<body>
<h1>Admin Login</h1>
<?php if ($error): ?><p><?= Security::sanitizeString($error) ?></p><?php endif; ?>
<form method="post">
  <input type="hidden" name="csrf_token" value="<?= Csrf::token() ?>">
  <label>Email <input type="email" name="email" required></label><br>
  <label>Password <input type="password" name="password" required></label><br>
  <button type="submit">Login</button>
</form>
</body>
</html>
