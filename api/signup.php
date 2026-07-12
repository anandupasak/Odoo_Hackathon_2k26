<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = $_POST['fullName'] ?? '';
    $employeeId = $_POST['employeeId'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $password = $_POST['password'] ?? '';

    // Basic validation
    if (empty($fullName) || empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Required fields are missing."]);
        exit;
    }

    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Business Rule: New signups strictly default to Employee role
        $stmt = $pdo->prepare("INSERT INTO users (full_name, employee_id, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, 'Employee')");
        $stmt->execute([$fullName, $employeeId, $email, $phone, $hashedPassword]);

        echo json_encode(["status" => "success", "message" => "Account created successfully."]);
    } catch (PDOException $e) {
        // Handle duplicate email/employee ID errors
        if ($e->getCode() == 23000) {
            echo json_encode(["status" => "error", "message" => "Email or Employee ID already exists."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Registration failed."]);
        }
    }
}
?>