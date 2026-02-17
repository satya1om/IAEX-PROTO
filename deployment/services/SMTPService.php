<?php

declare(strict_types=1);

final class SMTPService
{
    public function send(string $to, string $subject, string $html): bool
    {
        $host = (string) env('SMTP_HOST', '');
        $port = (int) env('SMTP_PORT', '587');
        $username = (string) env('SMTP_USER', '');
        $password = (string) env('SMTP_PASS', '');
        $encryption = strtolower((string) env('SMTP_ENCRYPTION', 'tls'));
        $from = (string) env('SMTP_FROM', 'no-reply@example.com');

        if ($host === '' || $username === '' || $password === '') {
            Logger::error('SMTP config incomplete', ['host' => $host, 'user' => $username]);
            return false;
        }

        try {
        $transportHost = $host;
        if ($encryption === 'ssl') {
            $transportHost = 'ssl://' . $host;
        }

        $socket = @fsockopen($transportHost, $port, $errno, $errstr, 15);
        if (!$socket) {
            Logger::error('SMTP connect failed', ['error' => $errstr, 'code' => $errno]);
            return false;
        }

        $this->expect($socket, [220]);
        $this->command($socket, 'EHLO localhost', [250]);

        if ($encryption === 'tls') {
            $this->command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                fclose($socket);
                Logger::error('SMTP TLS negotiation failed');
                return false;
            }
            $this->command($socket, 'EHLO localhost', [250]);
        }

        $this->command($socket, 'AUTH LOGIN', [334]);
        $this->command($socket, base64_encode($username), [334]);
        $this->command($socket, base64_encode($password), [235]);

        $this->command($socket, 'MAIL FROM:<' . $from . '>', [250]);
        $this->command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        $this->command($socket, 'DATA', [354]);

        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $from,
            'To: ' . $to,
            'Subject: ' . $subject,
            '',
            $html,
            '.',
        ];

        fwrite($socket, implode("\r\n", $headers) . "\r\n");
        $this->expect($socket, [250]);
        $this->command($socket, 'QUIT', [221]);
        fclose($socket);

        return true;
        } catch (Throwable $e) {
            Logger::error('SMTP send failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    private function command($socket, string $command, array $expectedCodes): void
    {
        fwrite($socket, $command . "\r\n");
        $this->expect($socket, $expectedCodes);
    }

    private function expect($socket, array $expectedCodes): void
    {
        $response = '';
        while (($line = fgets($socket, 515)) !== false) {
            $response .= $line;
            if (strlen($line) >= 4 && $line[3] === ' ') {
                break;
            }
        }

        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $expectedCodes, true)) {
            Logger::error('SMTP unexpected response', ['expected' => $expectedCodes, 'actual' => $code, 'response' => trim($response)]);
            throw new RuntimeException('SMTP command failed');
        }
    }
}
