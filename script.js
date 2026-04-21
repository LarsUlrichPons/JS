// --- 1. Variables & Data ---
const zzzAgents = [
    { name: "Anby DEMARA", faction: "Cunning Hares", image: "/assets/agents/anby.webp" },
    { name: "Nicole DEMARA", faction: "Cunning Hares", image: "/assets/agents/nicole.webp" },
    { name: "Billy KID", faction: "Cunning Hares", image: "/assets/agents/Agent_Billy_Kid_Portrait.webp" },
    { name: "Nekomata", faction: "Cunning Hares", image: "/assets/agents/Agent_Nekomiya_Mana_Portrait.webp" },
    { name: "Ellen JOE", faction: "Victoria Housekeeping", image: "/assets/agents/Agent_Ellen_Joe_Portrait.webp" },
    { name: "Von LYCAON", faction: "Victoria Housekeeping", image: "/assets/agents/Agent_Von_Lycaon_Portrait.webp" },
    { name: "Corin WICKES", faction: "Victoria Housekeeping", image: "/assets/agents/Agent_Corin_Wickes_Portrait.webp" },
    { name: "Alexandrina SEBASTIANE", faction: "Victoria Housekeeping", image: "/assets/agents/rina.webp" },
    { name: "Zhu YUAN", faction: "Criminal Investigation", image: "/assets/agents/zhu_yuan.webp" },
    { name: "Seth LOWELL", faction: "Criminal Investigation", image: "/assets/agents/Agent_Seth_Lowell_Portrait.webp" },
    { name: "Qingyi", faction: "Criminal Investigation", image: "/assets/agents/Agent_Qingyi_Portrait.webp" },
    { name: "Jane DOE", faction: "Criminal Investigation", image: "/assets/agents/Agent_Jane_Doe_Portrait.webp" },
    { name: "Grace HOWARD", faction: "Belobog Heavy Industries", image: "/assets/agents/Agent_Grace_Howard_Portrait.webp" },
    { name: "Anton IVANOV", faction: "Belobog Heavy Industries", image: "/assets/agents/anton.webp" },
    { name: "Ben BIGGER", faction: "Belobog Heavy Industries", image: "/assets/agents/Agent_Ben_Bigger_Portrait.webp" },
    { name: "Koleda BELOBOG", faction: "Belobog Heavy Industries", image: "/assets/agents/Agent_Koleda_Belobog_Portrait.webp" }
];

let remainingChallengers = [];
let currentLeftAgent = null;
let currentRightAgent = null;

// --- AUDIO SETUP ---
const bgMusic = new Audio('/assets/bg-music.mp3');
bgMusic.loop = true;  // Ensures the track repeats infinitely
bgMusic.volume = 0.4; // Lowers the volume slightly so it isn't blasting

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

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initializes the King of the Hill Match
function startGame() {
    let allAgentsScrambled = [...zzzAgents];
    shuffleArray(allAgentsScrambled);
    
    // Pick exactly 8 random agents for this run
    remainingChallengers = allAgentsScrambled.slice(0, 8);
    
    // Pull the first two agents to start the fight
    currentLeftAgent = remainingChallengers.pop();
    currentRightAgent = remainingChallengers.pop();
    
    updateCardUI('left', currentLeftAgent);
    updateCardUI('right', currentRightAgent);
    
    homeScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    selectionScreen.classList.remove("hidden");

    // Start the Background Music when the user clicks PLAY
    bgMusic.play().catch(e => console.log("Audio play prevented:", e));
}

// Helper function to update just one side of the screen
function updateCardUI(side, agent) {
    if (side === 'left') {
        leftImg.src = agent.image;
        leftName.innerText = agent.name;
        leftFaction.innerText = agent.faction;
    } else {
        rightImg.src = agent.image;
        rightName.innerText = agent.name;
        rightFaction.innerText = agent.faction;
    }
}

// Shows the final winner
// Shows the final winner
function showWinner(winner) {
    selectionScreen.classList.add("hidden");
    winScreen.classList.remove("hidden");

    winImg.src = winner.image;
    winName.innerText = winner.name;
    winFaction.innerText = winner.faction;

    // --- STOP THE BACKGROUND MUSIC ---
    bgMusic.pause();         // Pauses the music
    bgMusic.currentTime = 0; // Rewinds it to the beginning for the next game
}
// Handles replacing the loser with a new challenger and animating it
function processVote(winnerSide) {
    // 1. If no challengers are left, crown the final winner!
    if (remainingChallengers.length === 0) {
        let finalWinner = winnerSide === 'left' ? currentLeftAgent : currentRightAgent;
        showWinner(finalWinner);
        return;
    }

    // 2. Disable clicks during the animation
    leftCard.style.pointerEvents = "none";
    rightCard.style.pointerEvents = "none";
    
    let loserCard = winnerSide === 'left' ? rightCard : leftCard;
    let winnerCard = winnerSide === 'left' ? leftCard : rightCard;

    // 3. Hide VS badge and fade out the loser
    document.querySelector('.vs-badge').style.opacity = "0";
    loserCard.classList.add("fade-out");
    
    // 4. Slide the winner to the center (using your 170px layout math)
    const moveDistance = winnerSide === 'left' ? '170px' : '-170px';
    winnerCard.style.transform = `translateX(${moveDistance}) scale(1.1)`;
    winnerCard.style.zIndex = "50";

    // 5. Wait for the slide, then swap the loser with a new agent
    setTimeout(() => {
        let nextAgent = remainingChallengers.pop();

        if (winnerSide === 'left') {
            currentRightAgent = nextAgent;
            updateCardUI('right', nextAgent);
        } else {
            currentLeftAgent = nextAgent;
            updateCardUI('left', nextAgent);
        }

        // Reset animations and put the winner back in their original spot
        loserCard.classList.remove("fade-out");
        winnerCard.style.transform = "";
        winnerCard.style.zIndex = "";
        document.querySelector('.vs-badge').style.opacity = "1";
        
        // Re-enable clicks
        leftCard.style.pointerEvents = "auto";
        rightCard.style.pointerEvents = "auto";
        
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
    processVote('left');
});

rightCard.addEventListener("click", () => {
    processVote('right');
});