<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';

if (!Auth::check()) {
    header('Location: login.php');
    exit;
}

Auth::requireRole('admin');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Admin Dashboard</title>
</head>
<body>
  <h1>Admin Dashboard</h1>
  <p>System log file: <code>/logs/system.log</code></p>
  <ul>
    <li><a href="settings.php">Settings</a></li>
    <li><a href="logout.php">Logout</a></li>
  </ul>
</body>
</html>
