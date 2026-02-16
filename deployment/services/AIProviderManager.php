<?php

declare(strict_types=1);

final class AIProviderManager
{
    /** @var AIProviderInterface[] */
    private array $providers;

    public function __construct(array $providers)
    {
        $this->providers = $providers;
    }

    public function generate(string $prompt): array
    {
        $timeout = (int) env('AI_TIMEOUT_MS', '3000');

        foreach ($this->providers as $provider) {
            if (!$provider->isHealthy()) {
                continue;
            }

            try {
                $response = $provider->generate($prompt, $timeout);
                Logger::info('AI request served', ['provider' => $provider->name()]);
                return $response;
            } catch (Throwable $e) {
                Logger::error('AI provider failed', ['provider' => $provider->name(), 'error' => $e->getMessage()]);
            }
        }

        return [
            'provider' => 'none',
            'output' => 'No provider available.',
            'status' => 'failed',
        ];
    }
}
