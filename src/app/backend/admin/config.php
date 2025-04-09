<?php
$host = "localhost"; // Database host
$dbname = "aquaxypk_aquaxa"; // Database name
$username = "aquaxypk_root"; // Database username
$password = "!!@@##Aqua@123";

// Create a MySQLi connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
