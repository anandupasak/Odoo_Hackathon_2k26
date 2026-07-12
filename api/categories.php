<?php
// api/categories.php
header('Content-Type: application/json');
require_once '../db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM asset_categories ORDER BY id ASC");
        $categories = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $categories]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';

    if (empty($name)) {
        echo json_encode(["status" => "error", "message" => "Category name is required."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO asset_categories (name, description) VALUES (?, ?)");
        $stmt->execute([$name, $description]);
        echo json_encode(["status" => "success", "message" => "Category created successfully."]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(["status" => "error", "message" => "Category already exists."]);
        } else {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
?>
