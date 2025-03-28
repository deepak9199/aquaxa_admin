<?php
$host = "localhost"; // Database host
$dbname = "aquaxa"; // Database name
$username = "root"; // Database username
$password = "Deepak@123";

// Create a MySQLi connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
