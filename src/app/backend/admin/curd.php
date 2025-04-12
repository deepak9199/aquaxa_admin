<?php
require './cross_origin.php';
require './config.php';
require './auth.php';

// Authenticate request
authenticate();


// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle request
switch ($method) {
    case 'POST':
        createRecord($conn);
        break;
    case 'GET':
        getRecords($conn);
        break;
    case 'PUT':
        updateRecord($conn);
        break;
    case 'DELETE':
        deleteRecord($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
}

$conn->close();

// Function to create a record (POST)
function createRecord($conn)
{
    if (empty($_POST['table_name']) || empty($_POST['data'])) {
        http_response_code(400);
        die(json_encode(["error" => "Invalid request. 'table_name' and 'data' are required."]));
    }

    $table_name = $conn->real_escape_string($_POST['table_name']);
    $data = json_decode($_POST['data'], true);

    // Auto-create table if not exists
    $create_table_sql = "CREATE TABLE IF NOT EXISTS `$table_name` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    if (!$conn->query($create_table_sql)) {
        die(json_encode(["error" => "Failed to create table: " . $conn->error]));
    }

    // Add missing columns dynamically
    foreach ($data as $column => $value) {
        $column = $conn->real_escape_string($column);
        $col_type = is_numeric($value) ? "INT" : "VARCHAR(255)";
        $check_column_sql = "SHOW COLUMNS FROM `$table_name` LIKE '$column'";
        $result = $conn->query($check_column_sql);
        if ($result->num_rows === 0) {
            $alter_sql = "ALTER TABLE `$table_name` ADD `$column` $col_type";
            $conn->query($alter_sql);
        }
    }

    // Handle multi-image upload
   $image_urls = [];
if (!empty($_FILES['images']['name'][0])) {
    $upload_dir = "uploads/";
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    foreach ($_FILES['images']['name'] as $key => $name) {
        $file_tmp = $_FILES['images']['tmp_name'][$key];
        $file_ext = pathinfo($name, PATHINFO_EXTENSION);
        $file_name = time() . "_$key." . $file_ext;
        $file_path = $upload_dir . $file_name;
        if (move_uploaded_file($file_tmp, $file_path)) {
            $image_urls[] =  $file_path;
        }
    }

    // Check if 'images' column exists, add it if missing
    $check_images_column = "SHOW COLUMNS FROM `$table_name` LIKE 'images'";
    $result = $conn->query($check_images_column);
    if ($result->num_rows === 0) {
        $alter_images_column = "ALTER TABLE `$table_name` ADD `images` TEXT";
        $conn->query($alter_images_column);
    }

    // Store image URLs as comma-separated values
    $data['images'] = implode(',', $image_urls);
}


    // Insert record
    $columns = implode("`, `", array_keys($data));
    $values = implode("', '", array_map([$conn, 'real_escape_string'], array_values($data)));
    $insert_sql = "INSERT INTO `$table_name` (`$columns`) VALUES ('$values')";
    if ($conn->query($insert_sql)) {
        echo json_encode(["success" => "Record inserted", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["error" => "Insertion failed: " . $conn->error]);
    }
}

// Function to get records (GET)
function getRecords($conn)
{
    if (empty($_GET['table_name'])) {
        http_response_code(400);
        die(json_encode(["error" => "Missing 'table_name' parameter"]));
    }

    $table_name = $conn->real_escape_string($_GET['table_name']);
    $sql = "SELECT * FROM `$table_name`";

    if (!empty($_GET['id'])) {
        $id = intval($_GET['id']);
        $sql .= " WHERE id = $id";
    }

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            if (!empty($row['images'])) {
                $imagePaths = explode(',', $row['images']);
                foreach ($imagePaths as $index => $image) {
                    $imagePaths[$index] = "https://admin.aquaxa.in/" . $image;
                }
                $row['images'] = $imagePaths;
            }
            $data[] = $row;
        }
        echo json_encode(["success" => true, "data" => $data]);
    } else {
        echo json_encode(["error" => "No records found"]);
    }
}

// Function to update a record (PUT)
function updateRecord($conn)
{
    $_PUT = json_decode(file_get_contents("php://input"), true);
    if (empty($_PUT['table_name']) || empty($_PUT['id']) || empty($_PUT['data'])) {
        http_response_code(400);
        die(json_encode(["error" => "Missing required parameters"]));
    }

    $table_name = $conn->real_escape_string($_PUT['table_name']);
    $id = intval($_PUT['id']);
    $data = $_PUT['data'];

    $updates = [];
    foreach ($data as $column => $value) {
        $column = $conn->real_escape_string($column);
        $value = $conn->real_escape_string($value);
        $updates[] = "`$column` = '$value'";
    }

    $update_sql = "UPDATE `$table_name` SET " . implode(', ', $updates) . " WHERE id = $id";
    if ($conn->query($update_sql)) {
        echo json_encode(["success" => "Record updated"]);
    } else {
        echo json_encode(["error" => "Update failed: " . $conn->error]);
    }
}

// Function to delete a record (DELETE)
function deleteRecord($conn)
{
    $_DELETE = json_decode(file_get_contents("php://input"), true);
    $missing_params = [];

    if (empty($_DELETE['table_name'])) {
        $missing_params[] = 'table_name';
    }

    if (empty($_DELETE['id'])) {
        $missing_params[] = 'id';
    }

    if (!empty($missing_params)) {
        http_response_code(400);
        echo json_encode(["error" => "Missing parameters: " . implode(", ", $missing_params)]);
        return;
    }

    $table_name = $conn->real_escape_string($_DELETE['table_name']);
    $id = intval($_DELETE['id']);

    // Fetch the filename before deletion
    $file_query = "SELECT images FROM `$table_name` WHERE id = $id";
    $result = $conn->query($file_query);

    if ($result && $row = $result->fetch_assoc()) {
        $file_path = "uploads/" . $row['images']; // Assuming file_path stores only the filename

        // Delete the file if it exists
        if (!empty($row['file_path']) && file_exists($file_path)) {
            unlink($file_path);
        }
    }

    // Delete the record from the database
    $delete_sql = "DELETE FROM `$table_name` WHERE id = $id";
    if ($conn->query($delete_sql)) {
        echo json_encode(["success" => "Record and file deleted"]);
    } else {
        echo json_encode(["error" => "Deletion failed: " . $conn->error]);
    }
}
