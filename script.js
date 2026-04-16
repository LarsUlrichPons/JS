// --- 1. Variables & Data ---
// Add as many agents as you want here! They will be randomized.
const zzzAgents = [
    { name: "Anby DEMARA", faction: "Cunning Hares", image: "anby.jpg" },
    { name: "Nicole DEMARA", faction: "Cunning Hares", image: "nicole.jpg" },
    { name: "Billy KID", faction: "Cunning Hares", image: "billy.jpg" },
    { name: "Nekomata", faction: "Cunning Hares", image: "nekomata.jpg" },
    { name: "Ellen JOE", faction: "Victoria Housekeeping", image: "ellen.jpg" },
    { name: "Von LYCAON", faction: "Victoria Housekeeping", image: "lycaon.jpg" },
    { name: "Corin WICKES", faction: "Victoria Housekeeping", image: "corin.jpg" },
    { name: "Zhu YUAN", faction: "Criminal Investigation", image: "zhuyuan.jpg" }
];

let currentRound = [];
let nextRoundWinners = [];
let currentLeftAgent = null;
let currentRightAgent = null;

// --- 2. DOM Elements ---
const homeScreen = document.getElementById("home-screen");
const selectionScreen = document.getElementById("selection-screen");
const winScreen = document.getElementById("win-screen");

const playBtn = document.getElementById("play-btn");
const restartBtn = document.getElementById("restart-btn");

const leftCard = document.getElementById("left-card");
const rightCard = document.getElementById("right-card");

const leftImg = document.getElementById("left-img");
const leftName = document.getElementById("left-name");
const leftFaction = document.getElementById("left-faction");

const rightImg = document.getElementById("right-img");
const rightName = document.getElementById("right-name");
const rightFaction = document.getElementById("right-faction");

const winImg = document.getElementById("win-img");
const winName = document.getElementById("win-name");
const winFaction = document.getElementById("win-faction");

// --- 3. Functions ---

// Fisher-Yates Shuffle Algorithm (Randomizes the array)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initializes the tournament and switches screens
function startGame() {
    // Copy the master array into the current round
    currentRound = [...zzzAgents];
    
    // Scramble the agents so the matchups are random!
    shuffleArray(currentRound);
    
    nextRoundWinners = [];
    
    // Hide Home, Show Selection Arena
    homeScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    selectionScreen.classList.remove("hidden");

    renderMatchup();
}

// Pulls two agents and displays them
function renderMatchup() {
    // If current round is empty, move to the next bracket tier
    if (currentRound.length === 0) {
        if (nextRoundWinners.length === 1) {
            // Only one winner left!
            showWinner(nextRoundWinners[0]);
            return;
        } else {
            // Move winners to the new round, shuffle them, and reset winners array
            currentRound = [...nextRoundWinners];
            shuffleArray(currentRound); // Shuffle again so you don't fight the same sequence
            nextRoundWinners = [];
        }
    }

    // Grab the next two agents
    currentLeftAgent = currentRound.pop();
    currentRightAgent = currentRound.pop();

    // Update the cards with agent data
    leftImg.src = currentLeftAgent.image;
    leftName.innerText = currentLeftAgent.name;
    leftFaction.innerText = currentLeftAgent.faction;

    rightImg.src = currentRightAgent.image;
    rightName.innerText = currentRightAgent.name;
    rightFaction.innerText = currentRightAgent.faction;
}

// Transitions to the Win Screen
function showWinner(winner) {
    selectionScreen.classList.add("hidden");
    winScreen.classList.remove("hidden");

    winImg.src = winner.image;
    winName.innerText = winner.name;
    winFaction.innerText = winner.faction;
}

// Handles the sliding animation and records the vote
function animateSelection(winnerAgent, winnerCardElement, loserCardElement, sideClicked) {
    // 1. Disable clicks during animation
    leftCard.style.pointerEvents = "none";
    rightCard.style.pointerEvents = "none";
    
    // Hide the VS badge
    document.querySelector('.vs-badge').style.opacity = "0";

    // 2. Fade out the loser
    loserCardElement.classList.add("fade-out");

    // 3. Slide the winner to the center (170px for the new larger layout)
    const moveDistance = sideClicked === 'left' ? '170px' : '-170px';
    winnerCardElement.style.transform = `translateX(${moveDistance}) scale(1.1)`;
    winnerCardElement.style.zIndex = "50";

    // 4. Wait for the CSS animation to finish (600ms) before moving to next round
    setTimeout(() => {
        loserCardElement.classList.remove("fade-out");
        winnerCardElement.style.transform = "";
        winnerCardElement.style.zIndex = "";
        document.querySelector('.vs-badge').style.opacity = "1";
        
        leftCard.style.pointerEvents = "auto";
        rightCard.style.pointerEvents = "auto";

        // Record the winner and load the next images
        nextRoundWinners.push(winnerAgent);
        renderMatchup();
        
    }, 600); 
}

// --- 4. Events ---
playBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
    winScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

// Trigger the animation and vote logic
leftCard.addEventListener("click", () => {
    animateSelection(currentLeftAgent, leftCard, rightCard, 'left');
});

rightCard.addEventListener("click", () => {
    animateSelection(currentRightAgent, rightCard, leftCard, 'right');
});