// js/common.js

const StorageDB = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage', e);
            return false;
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Points configuration
const POINTS_CONFIG = {
    winningTeam: 5,
    finalScore: 10,
    firstGoalTeam: 4,
    firstGoalScorer: 8,
    minuteOfFirstGoal: 5, // within +-5
    totalGoals: 3,
    yellowCards: 3,
    redCards: 3,
    corners: 2,
    extraTime: 3,
    penaltyShootout: 3,
    motm: 5
};

// Utility function to get current user if needed, though predictions ask for Name per page.
// We will store predictions as an array of objects.
// If needed, we can add more common util functions here.
