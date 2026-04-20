<?php

declare(strict_types=1);

final class ApiRouter
{
    /** @var array<string, callable> */
    private array $routes = [];

    public function register(string $action, callable $handler): void
    {
        $this->routes[$action] = $handler;
    }

    public function dispatch(string $action): bool
    {
        if (!isset($this->routes[$action])) {
            return false;
        }

        ($this->routes[$action])();
        return true;
    }
}
