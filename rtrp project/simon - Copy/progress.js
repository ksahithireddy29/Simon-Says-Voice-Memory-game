const ctx = document.getElementById('progressChart').getContext('2d');
const data = {
    labels: ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5'],
    datasets: [{
        label: 'Score Progress',
        data: [1, 2, 2, 1, 3], // Example scores
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
        borderColor: 'rgba(54, 162, 235, 1)', // Blue border
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Points color
        pointRadius: 5,
        pointHoverRadius: 10,
    }]
};

const config = {
    type: 'line', // Line chart
    data: data,
    options: {
        responsive: true, // Makes the chart responsive
        plugins: {
            legend: {
                position: 'top', // Positioning legend
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false, // Hides gridlines on the x-axis
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)', // Light gridlines for the y-axis
                },
                ticks: {
                    color: '#333', // Ticks color
                    font: {
                        size: 14, // Font size for ticks
                    },
                },
            },
        },
        elements: {
            line: {
                tension: 0.4, // Smoothens the line
            },
        },
    },
};
function goBackToGame() {
    window.location.href = "game.html";
}


const progressChart = new Chart(ctx, config);
window.onload = function () {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;

    const scoresList = document.getElementById('scores-list');
    const gamesPlayedElement = document.getElementById('games-played');
    

}