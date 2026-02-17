<?php

declare(strict_types=1);

final class App
{
    public static function json(array $payload, int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function input(): array
    {
        $raw = file_get_contents('php://input');
        $json = json_decode((string) $raw, true);
        if (is_array($json)) {
            return $json;
        }

        return $_POST;
    }
}
