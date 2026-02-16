<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';

$limiter = new RateLimiter();
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!$limiter->check('api:' . $ip, (int) env('RATE_LIMIT_MAX', '100'), (int) env('RATE_LIMIT_WINDOW', '60'))) {
    App::json(['error' => 'Rate limit exceeded'], 429);
}

$action = $_GET['action'] ?? '';

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

App::json(['error' => 'Unsupported endpoint'], 404);
