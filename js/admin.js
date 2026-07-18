// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const jsonOutputSection = document.getElementById('json-output-section');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyBtn = document.getElementById('copyBtn');
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('adminPassword');
    const resultForm = document.getElementById('resultForm');

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === 'worldcup') {
            loginSection.classList.add('hidden');
            adminSection.classList.remove('hidden');
        } else {
            alert('Incorrect password');
        }
    });

    resultForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const results = {
            winningTeam: document.getElementById('resWinningTeam').value,
            finalScore: document.getElementById('resFinalScore').value,
            firstGoalTeam: document.getElementById('resFirstGoalTeam').value,
            firstGoalScorer: document.getElementById('resFirstGoalScorer').value,
            totalGoals: document.getElementById('resTotalGoals').value === '' ? null : parseInt(document.getElementById('resTotalGoals').value),
            yellowCards: document.getElementById('resYellowCards').value === '' ? null : parseInt(document.getElementById('resYellowCards').value),
            redCards: document.getElementById('resRedCards').value === '' ? null : parseInt(document.getElementById('resRedCards').value),
            corners: document.getElementById('resCorners').value === '' ? null : parseInt(document.getElementById('resCorners').value),
            extraTime: document.getElementById('resExtraTime').value,
            penaltyShootout: document.getElementById('resPenaltyShootout').value,
            motm: document.getElementById('resMotm').value
        };

        const jsonString = JSON.stringify(results, null, 2);
        jsonOutput.value = jsonString;
        jsonOutputSection.classList.remove('hidden');
    });

    copyBtn.addEventListener('click', () => {
        jsonOutput.select();
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
    });
});
