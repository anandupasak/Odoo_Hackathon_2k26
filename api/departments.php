<?php
// api/departments.php
header('Content-Type: application/json');
require_once '../db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT 
                d.id, 
                d.name, 
                d.head_id, 
                u.full_name as head_name, 
                d.parent_id, 
                p.name as parent_name, 
                d.status
            FROM departments d
            LEFT JOIN users u ON d.head_id = u.id
            LEFT JOIN departments p ON d.parent_id = p.id
            ORDER BY d.id ASC
        ");
        $departments = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $departments]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $name = $_POST['name'] ?? '';
    $head_id = $_POST['head_id'] ?? null;
    $parent_id = $_POST['parent_id'] ?? null;
    $status = $_POST['status'] ?? 'Active';

    if (empty($name)) {
        echo json_encode(["status" => "error", "message" => "Department name is required."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO departments (name, head_id, parent_id, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $name,
            $head_id === "" ? null : $head_id,
            $parent_id === "" ? null : $parent_id,
            $status
        ]);
        echo json_encode(["status" => "success", "message" => "Department created successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
