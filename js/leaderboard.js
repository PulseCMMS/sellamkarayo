// js/leaderboard.js
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardList = document.getElementById('leaderboardList');
    let predictions = StorageDB.get('worldCupPredictions') || [];

    if (predictions.length === 0) {
        return; // keeps the "No predictions found." message
    }

    // Sort by score descending
    predictions.sort((a, b) => b.score - a.score);

    leaderboardList.innerHTML = '';

    predictions.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'leader-card';
        
        let medal = '';
        if (index === 0) {
            medal = '🥇';
            div.classList.add('rank-1');
        } else if (index === 1) {
            medal = '🥈';
            div.classList.add('rank-2');
        } else if (index === 2) {
            medal = '🥉';
            div.classList.add('rank-3');
        } else {
            medal = `#${index + 1}`;
        }

        div.innerHTML = `
            <div class="leader-info">
                <div class="leader-name">${medal} ${p.playerName || 'Anonymous'}</div>
                <div class="leader-details">Predicted Win: ${p.teamToWin || 'None'} | Score: ${p.finalScore || 'None'}</div>
            </div>
            <div class="leader-score">${p.score} pts</div>
        `;
        
        leaderboardList.appendChild(div);
    });
});
