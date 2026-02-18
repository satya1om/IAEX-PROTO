<?php

declare(strict_types=1);

interface AIProviderInterface
{
    public function name(): string;

    public function isHealthy(): bool;

    public function generate(string $prompt, int $timeoutMs = 3000): array;
}
