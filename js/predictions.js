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
        if (StorageDB.get('worldCupActualResults')) {
            const scoreDisplay = document.getElementById('score-display');
            const userScore = document.getElementById('user-score');
            if (scoreDisplay && userScore && predictions.length > 0) {
                userScore.textContent = predictions[0].score || 0;
                scoreDisplay.classList.remove('hidden');
            }
        }
    }
});
