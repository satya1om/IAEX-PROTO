<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Csrf.php';
require_once __DIR__ . '/../core/RateLimiter.php';
require_once __DIR__ . '/../core/Logger.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/App.php';
require_once __DIR__ . '/../services/AIProviderInterface.php';
require_once __DIR__ . '/../services/NullAIProvider.php';
require_once __DIR__ . '/../services/AIProviderManager.php';
require_once __DIR__ . '/../services/SMTPService.php';

date_default_timezone_set(env('APP_TIMEZONE', 'UTC'));

$coreSecurity = new Security();
$coreSecurity->enforceHttps();
$coreSecurity->setSecureHeaders();
$coreSecurity->startSecureSession();
