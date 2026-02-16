<?php

declare(strict_types=1);

final class Auth
{
    public static function login(string $email, string $password): bool
    {
        $stmt = db()->prepare('SELECT u.id, u.email, u.password_hash, r.name AS role_name FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Logger::error('Failed login attempt', ['email' => $email]);
            return false;
        }

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['role'] = $user['role_name'];
        $_SESSION['email'] = $user['email'];
        session_regenerate_id(true);

        return true;
    }

    public static function check(): bool
    {
        return !empty($_SESSION['user_id']);
    }

    public static function requireRole(string $role): void
    {
        if (!self::check() || ($_SESSION['role'] ?? '') !== $role) {
            http_response_code(403);
            exit('Forbidden');
        }
    }

    public static function logout(): void
    {
        session_destroy();
    }
}
