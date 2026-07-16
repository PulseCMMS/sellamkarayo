// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const manageSection = document.getElementById('manage-predictions-section');
    const predictionsList = document.getElementById('predictionsList');
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('adminPassword');
    const resultForm = document.getElementById('resultForm');

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === 'worldcup') {
            loginSection.classList.add('hidden');
            adminSection.classList.remove('hidden');
            manageSection.classList.remove('hidden');
            loadResults();
            renderPredictions();
        } else {
            alert('Incorrect password');
        }
    });

    function loadResults() {
        const res = StorageDB.get('worldCupActualResults');
        if (res) {
            document.getElementById('resWinningTeam').value = res.winningTeam || '';
            document.getElementById('resFinalScore').value = res.finalScore || '';
            document.getElementById('resFirstGoalTeam').value = res.firstGoalTeam || '';
            document.getElementById('resFirstGoalScorer').value = res.firstGoalScorer || '';
            document.getElementById('resTotalGoals').value = res.totalGoals || '';
            document.getElementById('resYellowCards').value = res.yellowCards || '';
            document.getElementById('resRedCards').value = res.redCards || '';
            document.getElementById('resCorners').value = res.corners || '';
            document.getElementById('resExtraTime').value = res.extraTime || 'No';
            document.getElementById('resPenaltyShootout').value = res.penaltyShootout || 'No';
            document.getElementById('resMotm').value = res.motm || '';
        }
    }

    resultForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const results = {
            winningTeam: document.getElementById('resWinningTeam').value,
            finalScore: document.getElementById('resFinalScore').value,
            firstGoalTeam: document.getElementById('resFirstGoalTeam').value,
            firstGoalScorer: document.getElementById('resFirstGoalScorer').value,
            totalGoals: document.getElementById('resTotalGoals').value === '' ? '' : parseInt(document.getElementById('resTotalGoals').value),
            yellowCards: document.getElementById('resYellowCards').value === '' ? '' : parseInt(document.getElementById('resYellowCards').value),
            redCards: document.getElementById('resRedCards').value === '' ? '' : parseInt(document.getElementById('resRedCards').value),
            corners: document.getElementById('resCorners').value === '' ? '' : parseInt(document.getElementById('resCorners').value),
            extraTime: document.getElementById('resExtraTime').value,
            penaltyShootout: document.getElementById('resPenaltyShootout').value,
            motm: document.getElementById('resMotm').value
        };

        StorageDB.set('worldCupActualResults', results);

        let predictions = StorageDB.get('worldCupPredictions') || [];
        
        predictions = predictions.map(p => {
            let score = 0;
            if (p.teamToWin && results.winningTeam && p.teamToWin.toLowerCase().trim() === results.winningTeam.toLowerCase().trim()) score += POINTS_CONFIG.winningTeam;
            if (p.finalScore && results.finalScore && p.finalScore.toLowerCase().trim() === results.finalScore.toLowerCase().trim()) score += POINTS_CONFIG.finalScore;
            if (p.firstGoalTeam && results.firstGoalTeam && p.firstGoalTeam.toLowerCase().trim() === results.firstGoalTeam.toLowerCase().trim()) score += POINTS_CONFIG.firstGoalTeam;
            if (p.firstGoalScorer && results.firstGoalScorer && p.firstGoalScorer.toLowerCase().trim() === results.firstGoalScorer.toLowerCase().trim()) score += POINTS_CONFIG.firstGoalScorer;
            if (p.totalGoals !== '' && p.totalGoals === results.totalGoals) score += POINTS_CONFIG.totalGoals;
            if (p.yellowCards !== '' && p.yellowCards === results.yellowCards) score += POINTS_CONFIG.yellowCards;
            if (p.redCards !== '' && p.redCards === results.redCards) score += POINTS_CONFIG.redCards;
            if (p.corners !== '' && p.corners === results.corners) score += POINTS_CONFIG.corners;
            if (p.extraTime === results.extraTime) score += POINTS_CONFIG.extraTime;
            if (p.penaltyShootout === results.penaltyShootout) score += POINTS_CONFIG.penaltyShootout;
            if (p.motm && results.motm && p.motm.toLowerCase().trim() === results.motm.toLowerCase().trim()) score += POINTS_CONFIG.motm;
            
            p.score = score;
            return p;
        });

        StorageDB.set('worldCupPredictions', predictions);
        alert('Scores calculated and saved!');
        renderPredictions(); // Refresh the list to show updated scores
    });

    function renderPredictions() {
        let preds = StorageDB.get('worldCupPredictions') || [];
        predictionsList.innerHTML = '';
        if (preds.length === 0) {
            predictionsList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No predictions found.</p>';
            return;
        }

        preds.forEach((p, index) => {
            const div = document.createElement('div');
            div.className = 'prediction-item';
            div.style.padding = '1rem';
            div.style.background = 'rgba(255, 255, 255, 0.05)';
            div.style.borderRadius = '8px';
            div.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: var(--primary); font-size: 1.1em;">${p.playerName || 'Unknown Player'}</strong>
                        <div style="font-size: 0.85em; opacity: 0.8; margin-top: 0.5rem; line-height: 1.4;">
                            Winner: ${p.teamToWin || 'N/A'} <br>
                            Score: ${p.finalScore || 'N/A'} <br>
                            Points: ${p.score || 0}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                        <button class="btn btn-secondary edit-btn" data-index="${index}" style="padding: 0.4rem 0.8rem; font-size: 0.85em;">Edit Name</button>
                        <button class="btn btn-secondary del-btn" data-index="${index}" style="padding: 0.4rem 0.8rem; font-size: 0.85em; border-color: var(--danger); color: var(--danger);">Delete</button>
                    </div>
                </div>
            `;
            predictionsList.appendChild(div);
        });

        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (confirm('Are you sure you want to delete this prediction?')) {
                    let currentPreds = StorageDB.get('worldCupPredictions') || [];
                    currentPreds.splice(idx, 1);
                    StorageDB.set('worldCupPredictions', currentPreds);
                    
                    // If all predictions are deleted, unlock the form so the user can add a new one
                    if (currentPreds.length === 0) {
                        StorageDB.set('worldCupPredictionsLocked', false);
                    }
                    
                    renderPredictions();
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                let currentPreds = StorageDB.get('worldCupPredictions') || [];
                const currentName = currentPreds[idx].playerName || '';
                const newName = prompt('Enter new player name:', currentName);
                if (newName !== null && newName.trim() !== '') {
                    currentPreds[idx].playerName = newName.trim();
                    StorageDB.set('worldCupPredictions', currentPreds);
                    renderPredictions();
                }
            });
        });
    }
});
