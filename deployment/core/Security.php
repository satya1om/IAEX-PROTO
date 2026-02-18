<?php

declare(strict_types=1);

final class Security
{
    public function enforceHttps(): void
    {
        $https = $_SERVER['HTTPS'] ?? 'off';
        if ($https !== 'on' && php_sapi_name() !== 'cli') {
            $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $uri = $_SERVER['REQUEST_URI'] ?? '/';
            header('Location: https://' . $host . $uri, true, 301);
            exit;
        }
    }

    public function setSecureHeaders(): void
    {
        header('X-Frame-Options: SAMEORIGIN');
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('X-XSS-Protection: 1; mode=block');
        header("Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';");
    }

    public function startSecureSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        session_name(env('SESSION_NAME', 'iaex_session'));
        session_set_cookie_params([
            'lifetime' => (int) env('SESSION_LIFETIME', '7200'),
            'path' => '/',
            'secure' => env('SESSION_SECURE', 'true') === 'true',
            'httponly' => env('SESSION_HTTPONLY', 'true') === 'true',
            'samesite' => env('SESSION_SAMESITE', 'Strict'),
        ]);

        session_start();
    }

    public static function sanitizeString(?string $value): string
    {
        return htmlspecialchars(trim((string) $value), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
