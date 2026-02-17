<?php

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = $_POST['db_host'] ?? 'localhost';
    $port = $_POST['db_port'] ?? '3306';
    $name = $_POST['db_name'] ?? 'iaex_proto';
    $user = $_POST['db_user'] ?? 'root';
    $pass = $_POST['db_pass'] ?? '';
    $adminEmail = $_POST['admin_email'] ?? 'admin@example.com';
    $adminPass = $_POST['admin_password'] ?? 'ChangeMeStrong!123';

    $env = file_get_contents(__DIR__ . '/.env.example');
    $env = str_replace(['DB_HOST=localhost', 'DB_PORT=3306', 'DB_NAME=iaex_proto', 'DB_USER=root', 'DB_PASS=', 'ADMIN_EMAIL=admin@example.com', 'ADMIN_PASSWORD=ChangeMeStrong!123'], ["DB_HOST=$host", "DB_PORT=$port", "DB_NAME=$name", "DB_USER=$user", "DB_PASS=$pass", "ADMIN_EMAIL=$adminEmail", "ADMIN_PASSWORD=$adminPass"], $env);
    file_put_contents(__DIR__ . '/.env', $env);

    try {
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $sql = file_get_contents(__DIR__ . '/database.sql');
        $pdo->exec($sql);
        $pdo->exec("INSERT IGNORE INTO roles(name) VALUES ('admin'),('editor');");
        $hash = password_hash($adminPass, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO users(role_id,email,password_hash) VALUES (1,:email,:hash) ON DUPLICATE KEY UPDATE password_hash=:hash2');
        $stmt->execute(['email' => $adminEmail, 'hash' => $hash, 'hash2' => $hash]);
        echo 'Installation complete. Delete installer.php for security.';
        exit;
    } catch (Throwable $e) {
        echo 'Installation failed: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
        exit;
    }
}
?>
<!doctype html><html><body>
<h1>IAEX-PROTO Installer</h1>
<form method="post">
<input name="db_host" placeholder="DB Host" value="localhost" required><br>
<input name="db_port" placeholder="DB Port" value="3306" required><br>
<input name="db_name" placeholder="DB Name" value="iaex_proto" required><br>
<input name="db_user" placeholder="DB User" value="root" required><br>
<input name="db_pass" placeholder="DB Password" type="password"><br>
<input name="admin_email" placeholder="Admin Email" type="email" required><br>
<input name="admin_password" placeholder="Admin Password" type="password" required><br>
<button type="submit">Install</button>
</form>
</body></html>
