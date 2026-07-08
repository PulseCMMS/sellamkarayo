// js/bingo.js
const BINGO_EVENTS = [
    "Goal", "Yellow Card", "Red Card", "Corner", "VAR Review", 
    "Penalty Awarded", "Penalty Missed", "Offside", "Throw In", 
    "Goal Kick", "Free Kick", "Substitution", "Coach shown", 
    "Fans singing", "Player slips", "Header on target", 
    "Shot hits crossbar", "Big save", "Injury", 
    "Commentator says 'world class'", "Commentator says 'pressure'", 
    "Player argues with referee", "Long range shot", "Crowd boos", 
    "Replay shown", "Drinking water", "Captain talking to referee", 
    "Extra Time", "Penalty Shootout", "Own Goal", "Handball", 
    "Celebration", "Missed sitter", "Goalkeeper catches cross", 
    "Cross into box", "Dangerous tackle", "Referee whistles"
];

const LOCAL_STORAGE_KEY = 'worldCupBingoState';

document.addEventListener('DOMContentLoaded', () => {
    const setupSection = document.getElementById('setup-section');
    const gameSection = document.getElementById('game-section');
    const playerNameInput = document.getElementById('playerName');
    const generateBtn = document.getElementById('generateBtn');
    const bingoGrid = document.getElementById('bingoGrid');
    const greeting = document.getElementById('greeting');
    const resetBtn = document.getElementById('resetBtn');

    let gameState = StorageDB.get(LOCAL_STORAGE_KEY);

    if (gameState && gameState.card) {
        showGame(gameState);
    } else {
        setupSection.classList.remove('hidden');
    }

    generateBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (!name) {
            alert('Please enter your name');
            return;
        }

        const newCard = generateCard();
        gameState = {
            playerName: name,
            card: newCard,
            won: false
        };
        StorageDB.set(LOCAL_STORAGE_KEY, gameState);
        setupSection.classList.add('hidden');
        showGame(gameState);
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your card and start over?')) {
            StorageDB.remove(LOCAL_STORAGE_KEY);
            location.reload();
        }
    });

    function generateCard() {
        const shuffled = [...BINGO_EVENTS].sort(() => 0.5 - Math.random());
        const card = [];
        let index = 0;
        for (let i = 0; i < 25; i++) {
            if (i === 12) {
                card.push({ text: 'FREE', active: true, isFree: true });
            } else {
                card.push({ text: shuffled[index++], active: false, isFree: false });
            }
        }
        return card;
    }

    function showGame(state) {
        gameSection.classList.remove('hidden');
        greeting.textContent = `${state.playerName}'s Bingo Card`;
        renderGrid(state);
    }

    function renderGrid(state) {
        bingoGrid.innerHTML = '';
        state.card.forEach((cell, index) => {
            const div = document.createElement('div');
            div.className = 'bingo-cell' + (cell.active ? ' active' : '') + (cell.isFree ? ' free' : '');
            div.textContent = cell.text;
            
            if (!cell.isFree) {
                div.addEventListener('click', () => {
                    cell.active = !cell.active;
                    div.classList.toggle('active');
                    StorageDB.set(LOCAL_STORAGE_KEY, state);
                    if (cell.active && !state.won) {
                        checkBingo(state);
                    }
                });
            }
            bingoGrid.appendChild(div);
        });
    }

    function checkBingo(state) {
        const c = state.card;
        let hasBingo = false;

        // Check rows
        for (let i = 0; i < 5; i++) {
            if (c[i*5].active && c[i*5+1].active && c[i*5+2].active && c[i*5+3].active && c[i*5+4].active) hasBingo = true;
        }
        // Check cols
        for (let i = 0; i < 5; i++) {
            if (c[i].active && c[i+5].active && c[i+10].active && c[i+15].active && c[i+20].active) hasBingo = true;
        }
        // Check diagonals
        if (c[0].active && c[6].active && c[12].active && c[18].active && c[24].active) hasBingo = true;
        if (c[4].active && c[8].active && c[12].active && c[16].active && c[20].active) hasBingo = true;

        if (hasBingo) {
            state.won = true;
            StorageDB.set(LOCAL_STORAGE_KEY, state);
            showWinnerPopup();
        }
    }

    function showWinnerPopup() {
        Confetti.start();
        document.getElementById('winnerPopup').classList.add('show');
        // Simple synthetic sound
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1);
        } catch (e) {
            console.log('Audio error');
        }
    }
});
