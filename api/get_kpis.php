<?php
// api/get_kpis.php
header('Content-Type: application/json');
require_once '../db_connect.php';

try {
    // 1. Assets Available
    $stmt = $pdo->query("SELECT COUNT(*) FROM assets WHERE status = 'Available'");
    $availableAssets = $stmt->fetchColumn();

    // 2. Assets Allocated
    $stmt = $pdo->query("SELECT COUNT(*) FROM assets WHERE status = 'Allocated'");
    $allocatedAssets = $stmt->fetchColumn();

    // 3. Maintenance Today (Pending / In Progress)
    $stmt = $pdo->query("SELECT COUNT(*) FROM maintenance_requests WHERE status IN ('Pending', 'In Progress', 'Approved')");
    $maintenanceToday = $stmt->fetchColumn();

    // 4. Active Bookings (Upcoming / Ongoing)
    $stmt = $pdo->query("SELECT COUNT(*) FROM bookings WHERE status IN ('Upcoming', 'Ongoing')");
    $activeBookings = $stmt->fetchColumn();

    // 5. Pending Transfers
    $stmt = $pdo->query("SELECT COUNT(*) FROM allocations WHERE status = 'Active'");
    $pendingTransfers = $stmt->fetchColumn();

    // 6. Upcoming/Overdue Returns count
    $stmt = $pdo->query("SELECT COUNT(*) FROM allocations WHERE status = 'Active' AND expected_return_date < CURDATE() AND actual_return_date IS NULL");
    $overdueReturnsCount = $stmt->fetchColumn();

    // 7. Fetch Overdue Returns List
    $stmtOverdue = $pdo->query("
        SELECT 
            al.id, 
            asst.name as asset_name, 
            asst.asset_tag, 
            u.full_name as employee_name, 
            al.expected_return_date,
            DATEDIFF(CURDATE(), al.expected_return_date) as days_overdue
        FROM allocations al
        JOIN assets asst ON al.asset_id = asst.id
        JOIN users u ON al.assigned_to = u.id
        WHERE al.status = 'Active' AND al.expected_return_date < CURDATE() AND al.actual_return_date IS NULL
        ORDER BY days_overdue DESC
        LIMIT 5
    ");
    $overdueList = $stmtOverdue->fetchAll();

    // 8. Asset Distribution for chart
    $stmtChart = $pdo->query("SELECT status, COUNT(*) as count FROM assets GROUP BY status");
    $chartData = [];
    while ($row = $stmtChart->fetch()) {
        $chartData[$row['status']] = (int)$row['count'];
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "kpis" => [
                "assetsAvailable" => (int)$availableAssets,
                "assetsAllocated" => (int)$allocatedAssets,
                "maintenanceToday" => (int)$maintenanceToday,
                "activeBookings" => (int)$activeBookings,
                "pendingTransfers" => (int)$pendingTransfers,
                "upcomingReturns" => (int)$overdueReturnsCount
            ],
            "overdueList" => $overdueList,
            "chartData" => $chartData
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database query failed: " . $e->getMessage()
    ]);
}
?>
