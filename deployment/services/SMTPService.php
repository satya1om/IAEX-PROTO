<?php

declare(strict_types=1);

final class SMTPService
{
    public function send(string $to, string $subject, string $html): bool
    {
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=utf-8',
            'From: ' . env('SMTP_FROM', 'no-reply@example.com'),
        ];

        $sent = mail($to, $subject, $html, implode("\r\n", $headers));

        if (!$sent) {
            Logger::error('Mail send failed', ['to' => $to, 'subject' => $subject]);
        }

        return $sent;
    }
}
