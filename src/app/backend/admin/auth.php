<?php
$api_token = "!!@@##ten@9234434490!!@@##"; // Define your API token

function authenticate()
{
    global $api_token;
    $headers = getallheaders();

    if (!isset($headers['Authorization']) || $headers['Authorization'] !== "Bearer $api_token") {
        http_response_code(403);
        die(json_encode(["error" => "Unauthorized"]));
    }
}
header("Content-Type: application/json");
