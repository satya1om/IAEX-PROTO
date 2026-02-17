<?php

declare(strict_types=1);

final class RateLimiter
{
    private string $storageFile;

    public function __construct()
    {
        $this->storageFile = dirname(__DIR__) . '/storage/rate_limit.json';
        if (!is_file($this->storageFile)) {
            file_put_contents($this->storageFile, '{}');
        }
    }

    public function check(string $key, int $max, int $windowSec): bool
    {
        $all = json_decode((string) file_get_contents($this->storageFile), true) ?: [];
        $now = time();

        $entry = $all[$key] ?? ['count' => 0, 'start' => $now];
        if (($now - $entry['start']) > $windowSec) {
            $entry = ['count' => 0, 'start' => $now];
        }

        $entry['count']++;
        $all[$key] = $entry;
        file_put_contents($this->storageFile, json_encode($all, JSON_PRETTY_PRINT));

        return $entry['count'] <= $max;
    }
}
