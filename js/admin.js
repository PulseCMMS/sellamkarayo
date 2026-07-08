// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('adminPassword');
    const resultForm = document.getElementById('resultForm');

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === 'worldcup') {
            loginSection.classList.add('hidden');
            adminSection.classList.remove('hidden');
            loadResults();
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
            document.getElementById('resMinuteFirstGoal').value = res.minuteFirstGoal || '';
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
            winningTeam: document.getElementById('resWinningTeam').value.toLowerCase().trim(),
            finalScore: document.getElementById('resFinalScore').value.toLowerCase().trim(),
            firstGoalTeam: document.getElementById('resFirstGoalTeam').value.toLowerCase().trim(),
            firstGoalScorer: document.getElementById('resFirstGoalScorer').value.toLowerCase().trim(),
            minuteFirstGoal: parseInt(document.getElementById('resMinuteFirstGoal').value) || 0,
            totalGoals: parseInt(document.getElementById('resTotalGoals').value) || 0,
            yellowCards: parseInt(document.getElementById('resYellowCards').value) || 0,
            redCards: parseInt(document.getElementById('resRedCards').value) || 0,
            corners: parseInt(document.getElementById('resCorners').value) || 0,
            extraTime: document.getElementById('resExtraTime').value,
            penaltyShootout: document.getElementById('resPenaltyShootout').value,
            motm: document.getElementById('resMotm').value.toLowerCase().trim()
        };

        StorageDB.set('worldCupActualResults', results);

        let predictions = StorageDB.get('worldCupPredictions') || [];
        
        predictions = predictions.map(p => {
            let score = 0;
            if (p.teamToWin && p.teamToWin.toLowerCase().trim() === results.winningTeam) score += POINTS_CONFIG.winningTeam;
            if (p.finalScore && p.finalScore.toLowerCase().trim() === results.finalScore) score += POINTS_CONFIG.finalScore;
            if (p.firstGoalTeam && p.firstGoalTeam.toLowerCase().trim() === results.firstGoalTeam) score += POINTS_CONFIG.firstGoalTeam;
            if (p.firstGoalScorer && p.firstGoalScorer.toLowerCase().trim() === results.firstGoalScorer) score += POINTS_CONFIG.firstGoalScorer;
            if (p.minuteOfFirstGoal > 0 && Math.abs(p.minuteOfFirstGoal - results.minuteFirstGoal) <= 5) score += POINTS_CONFIG.minuteOfFirstGoal;
            if (p.totalGoals === results.totalGoals) score += POINTS_CONFIG.totalGoals;
            if (p.yellowCards === results.yellowCards) score += POINTS_CONFIG.yellowCards;
            if (p.redCards === results.redCards) score += POINTS_CONFIG.redCards;
            if (p.corners === results.corners) score += POINTS_CONFIG.corners;
            if (p.extraTime === results.extraTime) score += POINTS_CONFIG.extraTime;
            if (p.penaltyShootout === results.penaltyShootout) score += POINTS_CONFIG.penaltyShootout;
            if (p.motm && p.motm.toLowerCase().trim() === results.motm) score += POINTS_CONFIG.motm;
            
            p.score = score;
            return p;
        });

        StorageDB.set('worldCupPredictions', predictions);
        alert('Scores calculated and saved!');
    });
});
