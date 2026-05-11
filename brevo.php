<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://parentsecrans.fr');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email invalide']);
    exit;
}

$email   = $data['email'];
$score   = intval($data['score'] ?? 0);
$segment = 'usage_modere';
if ($score > 8 && $score <= 18) $segment = 'dependance_moderee';
if ($score > 18)                 $segment = 'dependance_forte';

$payload = json_encode([
    'email'         => $email,
    'listIds'       => [1],
    'updateEnabled' => true,
    'attributes'    => [
        'SCORE_QUIZ' => $score,
        'SEGMENT'    => $segment
    ]
]);

$ch = curl_init('https://api.brevo.com/v3/contacts');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Accept: application/json',
        'api-key: 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'
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201 || $httpCode === 204) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur Brevo', 'detail' => $response]);
}
