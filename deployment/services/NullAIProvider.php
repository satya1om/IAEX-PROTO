<?php

declare(strict_types=1);

final class NullAIProvider implements AIProviderInterface
{
    public function name(): string
    {
        return 'null';
    }

    public function isHealthy(): bool
    {
        return true;
    }

    public function generate(string $prompt, int $timeoutMs = 3000): array
    {
        return [
            'provider' => $this->name(),
            'output' => 'AI is disabled for this deployment. Prompt received safely.',
            'status' => 'degraded',
        ];
    }
}
