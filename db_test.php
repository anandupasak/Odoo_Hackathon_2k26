<?php
// db_test.php
require_once 'db_connect.php';

$connectionStatus = 'Disconnected';
$connectionError = '';
$dbInfo = [];
$tablesInfo = [];
$seedMessage = '';
$activeTable = $_GET['table'] ?? '';
$tableData = [];
$tableColumns = [];

try {
    $connectionStatus = 'Connected';
    
    // Get server details
    $dbInfo['server_version'] = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
    $dbInfo['driver_name'] = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $dbInfo['client_version'] = $pdo->getAttribute(PDO::ATTR_CLIENT_VERSION);
    
    // Handle Seeding of Demo Data
    if (isset($_POST['seed_data'])) {
        // Seed default Category
        $stmt = $pdo->prepare("INSERT IGNORE INTO asset_categories (id, name, description) VALUES (1, 'Laptops', 'Corporate standard issue laptops')");
        $stmt->execute();
        
        // Seed Admin user
        $hashedPass = password_hash('Admin123!', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT IGNORE INTO users (id, full_name, employee_id, email, phone, password_hash, role) VALUES (1, 'Anand', 'EMP-0001', 'admin@assetflow.com', '9876543210', ?, 'Admin')");
        $stmt->execute([$hashedPass]);
        
        // Seed standard assets
        $stmt = $pdo->prepare("INSERT IGNORE INTO assets (asset_tag, name, category_id, serial_number, status, condition_notes, location, is_bookable) VALUES 
            ('AF-0114', 'Dell Latitude 5420', 1, 'DL-88923-X', 'Available', 'Excellent condition', 'Floor 3, Desk 42', 1),
            ('AF-0089', 'iPad Pro 12.9', 1, 'AP-7781-Z', 'Available', 'Slight scratch on back', 'IT Store Room', 1)
        ");
        $stmt->execute();

        $seedMessage = "Database seeded successfully with initial test data!";
    }

    // List all tables and counts
    $tables = ['departments', 'users', 'asset_categories', 'assets', 'allocations', 'bookings', 'maintenance_requests', 'audit_cycles', 'audit_records'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `$table`");
            $row = $stmt->fetch();
            $tablesInfo[$table] = [
                'status' => 'OK',
                'count' => $row['cnt']
            ];
        } catch (PDOException $e) {
            $tablesInfo[$table] = [
                'status' => 'Error: ' . $e->getMessage(),
                'count' => 0
            ];
        }
    }

    // Fetch details of active table if specified
    if (!empty($activeTable) && in_array($activeTable, $tables)) {
        try {
            $stmt = $pdo->query("SELECT * FROM `$activeTable` LIMIT 100");
            $tableData = $stmt->fetchAll();
            if (count($tableData) > 0) {
                $tableColumns = array_keys($tableData[0]);
            } else {
                // Get columns even if table is empty
                $stmtCol = $pdo->query("DESCRIBE `$activeTable`");
                while ($col = $stmtCol->fetch()) {
                    $tableColumns[] = $col['Field'];
                }
            }
        } catch (PDOException $e) {
            $connectionError = "Failed to query table: " . $e->getMessage();
        }
    }
} catch (Exception $e) {
    $connectionStatus = 'Failed';
    $connectionError = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Status & Viewer | AssetFlow ERP</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0F172A;
            --card-bg: #1E293B;
            --text-color: #F8FAFC;
            --text-muted: #94A3B8;
            --accent-green: #10B981;
            --accent-red: #EF4444;
            --accent-blue: #3B82F6;
            --border-color: #334155;
            --active-bg: rgba(59, 130, 246, 0.15);
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            box-sizing: border-box;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border: 1px solid var(--border-color);
            padding: 32px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 20px;
            margin-bottom: 24px;
        }

        .header h1 {
            font-size: 24px;
            margin: 0;
            font-weight: 700;
            background: linear-gradient(135deg, #3B82F6, #10B981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .status-badge.success {
            background-color: rgba(16, 185, 129, 0.15);
            color: var(--accent-green);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-badge.error {
            background-color: rgba(239, 68, 68, 0.15);
            color: var(--accent-red);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .layout-grid {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 32px;
            margin-bottom: 30px;
        }

        @media (max-width: 900px) {
            .layout-grid {
                grid-template-columns: 1fr;
            }
        }

        .sidebar-panel {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .info-card {
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 12px;
        }

        .info-card h3 {
            margin: 0 0 8px 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
        }

        .info-card p {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
        }

        .table-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .table-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: rgba(15, 23, 42, 0.2);
            text-decoration: none;
            color: var(--text-color);
            transition: all 0.2s ease;
        }

        .table-item:hover {
            border-color: var(--accent-blue);
            background: rgba(59, 130, 246, 0.05);
        }

        .table-item.active {
            border-color: var(--accent-blue);
            background: var(--active-bg);
            color: #60A5FA;
            font-weight: 600;
        }

        .table-name {
            font-family: monospace;
            font-size: 14px;
        }

        .table-count {
            background: var(--border-color);
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-color);
        }

        .table-item.active .table-count {
            background: var(--accent-blue);
            color: white;
        }

        .data-panel {
            background: rgba(15, 23, 42, 0.3);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            overflow-x: auto;
            min-height: 400px;
        }

        .data-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
        }

        .data-panel-header h2 {
            margin: 0;
            font-size: 18px;
            font-family: monospace;
            color: #60A5FA;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
        }

        .data-table th {
            background: rgba(15, 23, 42, 0.6);
            color: var(--text-muted);
            font-weight: 600;
            padding: 12px;
            border-bottom: 2px solid var(--border-color);
            font-family: monospace;
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            color: #E2E8F0;
        }

        .data-table tr:hover {
            background: rgba(255, 255, 255, 0.02);
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 300px;
            color: var(--text-muted);
            text-align: center;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            border-top: 1px solid var(--border-color);
            padding-top: 24px;
            margin-top: 20px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
        }

        .btn-primary {
            background-color: var(--accent-blue);
            color: white;
        }

        .btn-primary:hover {
            background-color: #2563EB;
            transform: translateY(-1px);
        }

        .btn-success {
            background-color: var(--accent-green);
            color: white;
        }

        .btn-success:hover {
            background-color: #059669;
            transform: translateY(-1px);
        }

        .alert {
            background-color: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: var(--accent-green);
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 24px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AssetFlow Database Health & Viewer</h1>
            <span class="status-badge <?php echo $connectionStatus === 'Connected' ? 'success' : 'error'; ?>">
                ● <?php echo $connectionStatus; ?>
            </span>
        </div>

        <?php if ($seedMessage): ?>
            <div class="alert">
                ✓ <?php echo $seedMessage; ?>
            </div>
        <?php endif; ?>

        <?php if ($connectionStatus === 'Connected'): ?>
            <div class="layout-grid">
                <!-- Sidebar -->
                <div class="sidebar-panel">
                    <div>
                        <div class="info-card">
                            <h3>DB Driver</h3>
                            <p><?php echo htmlspecialchars(ucfirst($dbInfo['driver_name'])); ?></p>
                        </div>
                        <div class="info-card">
                            <h3>MariaDB/MySQL</h3>
                            <p><?php echo htmlspecialchars(substr($dbInfo['server_version'], 0, 15)); ?></p>
                        </div>
                    </div>

                    <div class="table-list">
                        <h3 style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Tables</h3>
                        <?php foreach ($tablesInfo as $name => $info): ?>
                            <a href="?table=<?php echo urlencode($name); ?>" class="table-item <?php echo $activeTable === $name ? 'active' : ''; ?>">
                                <span class="table-name"><?php echo htmlspecialchars($name); ?></span>
                                <span class="table-count"><?php echo htmlspecialchars($info['count']); ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Data Table Panel -->
                <div class="data-panel">
                    <?php if (!empty($activeTable)): ?>
                        <div class="data-panel-header">
                            <h2>TABLE: <?php echo htmlspecialchars($activeTable); ?></h2>
                            <span class="table-count"><?php echo count($tableData); ?> records shown (Max 100)</span>
                        </div>
                        
                        <?php if (count($tableData) > 0): ?>
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <?php foreach ($tableColumns as $col): ?>
                                            <th><?php echo htmlspecialchars($col); ?></th>
                                        <?php endforeach; ?>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($tableData as $row): ?>
                                        <tr>
                                            <?php foreach ($tableColumns as $col): ?>
                                                <td>
                                                    <?php 
                                                    if ($row[$col] === null) {
                                                        echo '<em style="color: var(--text-muted);">NULL</em>';
                                                    } elseif (strpos($col, 'password_hash') !== false) {
                                                        echo '<span style="color: var(--text-muted); font-family: monospace;">••••••••</span>';
                                                    } else {
                                                        echo htmlspecialchars($row[$col]);
                                                    }
                                                    ?>
                                                </td>
                                            <?php endforeach; ?>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php else: ?>
                            <div class="empty-state">
                                <div class="empty-state-icon">📭</div>
                                <h3>Table is empty</h3>
                                <p>No records found in "<?php echo htmlspecialchars($activeTable); ?>". Try seeding test data or registering an account.</p>
                            </div>
                        <?php endif; ?>
                    <?php else: ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">📊</div>
                            <h3>Welcome to Database Viewer</h3>
                            <p>Select any table from the sidebar to inspect its contents and columns live.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="actions">
                <form method="POST" style="margin: 0;">
                    <button type="submit" name="seed_data" class="btn btn-success">Seed Test Data</button>
                </form>
                <a href="/index.html" class="btn btn-primary">Go to Login Page</a>
            </div>
        <?php else: ?>
            <div style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--accent-red); padding: 16px; border-radius: 8px;">
                <h3 style="margin-top: 0;">Database Connection Failed</h3>
                <p><?php echo htmlspecialchars($connectionError); ?></p>
                <p>Please make sure that the local MySQL service is running and configured correctly in <code>db_connect.php</code>.</p>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
