// js/predictions.js
const PREDICTIONS_KEY = 'worldCupPredictions';
const PREDICTIONS_LOCKED_KEY = 'worldCupPredictionsLocked';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const lockBtn = document.getElementById('lockBtn');
    const formCard = document.getElementById('prediction-form-card');
    const lockedMessage = document.getElementById('locked-message');

    // To simulate multiple users for leaderboard, we store an array of predictions
    let predictions = StorageDB.get(PREDICTIONS_KEY) || [];
    let isLocked = StorageDB.get(PREDICTIONS_LOCKED_KEY) || false;

    // Try to load the current user's prediction if exists.
    // In a real app we'd identify by some device ID, but here we'll assume index 0 is the current user.
    if (predictions.length > 0) {
        populateForm(predictions[0]);
    }

    if (isLocked) {
        showLockedState();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isLocked) return;

        const prediction = {
            id: predictions.length > 0 ? predictions[0].id : Date.now(),
            playerName: document.getElementById('playerName').value,
            teamToWin: document.getElementById('teamToWin').value,
            finalScore: document.getElementById('finalScore').value,
            firstGoalTeam: document.getElementById('firstGoalTeam').value,
            firstGoalScorer: document.getElementById('firstGoalScorer').value,
            totalGoals: document.getElementById('totalGoals').value === '' ? '' : parseInt(document.getElementById('totalGoals').value),
            yellowCards: document.getElementById('yellowCards').value === '' ? '' : parseInt(document.getElementById('yellowCards').value),
            redCards: document.getElementById('redCards').value === '' ? '' : parseInt(document.getElementById('redCards').value),
            corners: document.getElementById('corners').value === '' ? '' : parseInt(document.getElementById('corners').value),
            extraTime: document.getElementById('extraTime').value,
            penaltyShootout: document.getElementById('penaltyShootout').value,
            motm: document.getElementById('motm').value,
            score: 0 
        };

        predictions[0] = prediction;
        StorageDB.set(PREDICTIONS_KEY, predictions);
        alert('Predictions saved successfully!');
    });

    lockBtn.addEventListener('click', () => {
        if (!predictions[0]) {
            alert('Please save your predictions first.');
            return;
        }
        if (confirm('Are you sure you want to lock? You cannot edit them after this.')) {
            isLocked = true;
            StorageDB.set(PREDICTIONS_LOCKED_KEY, true);
            showLockedState();
        }
    });

    function populateForm(data) {
        document.getElementById('playerName').value = data.playerName || '';
        document.getElementById('teamToWin').value = data.teamToWin || '';
        document.getElementById('finalScore').value = data.finalScore || '';
        document.getElementById('firstGoalTeam').value = data.firstGoalTeam || '';
        document.getElementById('firstGoalScorer').value = data.firstGoalScorer || '';
        document.getElementById('totalGoals').value = data.totalGoals || '';
        document.getElementById('yellowCards').value = data.yellowCards || '';
        document.getElementById('redCards').value = data.redCards || '';
        document.getElementById('corners').value = data.corners || '';
        document.getElementById('extraTime').value = data.extraTime || 'No';
        document.getElementById('penaltyShootout').value = data.penaltyShootout || 'No';
        document.getElementById('motm').value = data.motm || '';
    }

    function showLockedState() {
        const inputs = form.querySelectorAll('input, select, button');
        inputs.forEach(input => input.disabled = true);
        lockBtn.style.display = 'none';
        lockedMessage.classList.remove('hidden');

        // Check if admin has published actual results (meaning scores are calculated)
        const actualResults = StorageDB.get('worldCupActualResults');
        if (actualResults) {
            const scoreDisplay = document.getElementById('score-display');
            const userScore = document.getElementById('user-score');
            if (scoreDisplay && userScore && predictions.length > 0) {
                userScore.textContent = predictions[0].score || 0;
                
                // Generate breakdown
                const p = predictions[0];
                let breakdownHTML = '<ul style="text-align: left; margin-top: 1rem; font-size: 1rem; font-weight: normal; list-style-type: none; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 8px;">';
                let hasPoints = false;
                
                if (p.teamToWin && p.teamToWin.toLowerCase().trim() === actualResults.winningTeam) { breakdownHTML += `<li>✅ Team to Win: +${POINTS_CONFIG.winningTeam}</li>`; hasPoints = true; }
                if (p.finalScore && p.finalScore.toLowerCase().trim() === actualResults.finalScore) { breakdownHTML += `<li>✅ Final Score: +${POINTS_CONFIG.finalScore}</li>`; hasPoints = true; }
                if (p.firstGoalTeam && p.firstGoalTeam.toLowerCase().trim() === actualResults.firstGoalTeam) { breakdownHTML += `<li>✅ First Goal Team: +${POINTS_CONFIG.firstGoalTeam}</li>`; hasPoints = true; }
                if (p.firstGoalScorer && p.firstGoalScorer.toLowerCase().trim() === actualResults.firstGoalScorer) { breakdownHTML += `<li>✅ First Goal Scorer: +${POINTS_CONFIG.firstGoalScorer}</li>`; hasPoints = true; }
                if (p.totalGoals !== '' && p.totalGoals === actualResults.totalGoals) { breakdownHTML += `<li>✅ Total Goals: +${POINTS_CONFIG.totalGoals}</li>`; hasPoints = true; }
                if (p.yellowCards !== '' && p.yellowCards === actualResults.yellowCards) { breakdownHTML += `<li>✅ Yellow Cards: +${POINTS_CONFIG.yellowCards}</li>`; hasPoints = true; }
                if (p.redCards !== '' && p.redCards === actualResults.redCards) { breakdownHTML += `<li>✅ Red Cards: +${POINTS_CONFIG.redCards}</li>`; hasPoints = true; }
                if (p.corners !== '' && p.corners === actualResults.corners) { breakdownHTML += `<li>✅ Corners: +${POINTS_CONFIG.corners}</li>`; hasPoints = true; }
                if (p.extraTime === actualResults.extraTime) { breakdownHTML += `<li>✅ Extra Time: +${POINTS_CONFIG.extraTime}</li>`; hasPoints = true; }
                if (p.penaltyShootout === actualResults.penaltyShootout) { breakdownHTML += `<li>✅ Penalty Shootout: +${POINTS_CONFIG.penaltyShootout}</li>`; hasPoints = true; }
                if (p.motm && p.motm.toLowerCase().trim() === actualResults.motm) { breakdownHTML += `<li>✅ Man of the Match: +${POINTS_CONFIG.motm}</li>`; hasPoints = true; }
                
                if (!hasPoints) {
                    breakdownHTML += '<li>No points scored yet.</li>';
                }
                breakdownHTML += '</ul>';

                let breakdownContainer = document.getElementById('score-breakdown');
                if (!breakdownContainer) {
                    breakdownContainer = document.createElement('div');
                    breakdownContainer.id = 'score-breakdown';
                    scoreDisplay.appendChild(breakdownContainer);
                }
                breakdownContainer.innerHTML = breakdownHTML;

                scoreDisplay.classList.remove('hidden');
            }
        }
    }
});
