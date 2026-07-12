<?php
// api/users.php
header('Content-Type: application/json');
require_once '../db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT 
                u.id, 
                u.full_name, 
                u.employee_id, 
                u.email, 
                u.phone, 
                u.role, 
                u.department_id,
                d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            ORDER BY u.id ASC
        ");
        $users = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $users]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $fullName = $_POST['fullName'] ?? '';
    $employeeId = $_POST['employeeId'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $role = $_POST['role'] ?? 'Employee';
    $departmentId = $_POST['departmentId'] ?? null;
    $password = $_POST['password'] ?? 'User123!'; // Default password if created by Admin

    if (empty($fullName) || empty($email) || empty($employeeId)) {
        echo json_encode(["status" => "error", "message" => "Required fields are missing."]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("
            INSERT INTO users (full_name, employee_id, email, phone, password_hash, role, department_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $fullName,
            $employeeId,
            $email,
            $phone,
            $hashedPassword,
            $role,
            $departmentId === "" ? null : $departmentId
        ]);
        echo json_encode(["status" => "success", "message" => "User created successfully."]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(["status" => "error", "message" => "Email or Employee ID already exists."]);
        } else {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
?>
