document.addEventListener("DOMContentLoaded", () => {

    // 1. Initialize all Lucide Icons
    lucide.createIcons();

    // 2. Set Today's Date dynamically
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        // Outputs format like: "July 12, 2026"
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // 3. Initialize Donut Chart using Chart.js CDN
    const canvas = document.getElementById('assetChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        const assetData = {
            labels: ['Available', 'Allocated', 'Reserved', 'Maintenance', 'Lost/Disposed'],
            datasets: [{
                data: [1245, 945, 120, 45, 12],
                backgroundColor: [
                    '#10B981', // Emerald
                    '#3B82F6', // Blue
                    '#8B5CF6', // Purple
                    '#F59E0B', // Amber
                    '#EF4444'  // Red
                ],
                borderWidth: 0,
                hoverOffset: 6
            }]
        };

        const config = {
            type: 'doughnut',
            data: assetData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%', // Makes it a thin, modern donut
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1A1A24',
                        titleFont: { family: "'Inter', sans-serif", size: 13 },
                        bodyFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        boxPadding: 6
                    }
                }
            }
        };

        new Chart(ctx, config);
    }
});