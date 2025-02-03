let score = 0;
let speed = 5;
let gameInterval;
let moveInterval;
let speedIncreaseInterval;
let isGameOver = false;
let highScore = localStorage.getItem('highScore') || 0;
let isMovingRight = true;

let baseSpawnInterval = 1000; // Start with 1 second
let pointsPerFireball = 5;

let health = 3;  // Player starts with 3 hearts
let speedReductionFactor = 0.8;  // Reduce game speed when losing a heart


// T-Rex animation handler
document.getElementById('trex').addEventListener('animationend', () => {
    const trex = document.getElementById('trex');
    trex.classList.remove('running', 'running-reverse');
    isMovingRight = !isMovingRight;
    trex.classList.add(isMovingRight ? 'running' : 'running-reverse');
});

function showInstructions() {
    document.getElementById('instructions-modal').style.display = 'block';
}

function closeInstructions() {
    document.getElementById('instructions-modal').style.display = 'none';
}

function createFallingObject() {
    const object = document.createElement('div');
    object.className = 'falling-object';
    const maxX = window.innerWidth - 120;
    object.style.left = `${Math.random() * maxX}px`;
    object.style.top = '-100px';
    

    object.addEventListener('click', () => {
        if (!isGameOver) {
            score += pointsPerFireball; //points increase as the game speeds
            document.getElementById('score-board').textContent = `Score: ${score}`;
            object.remove();
             // Play fireball click sound
            const clickSound = document.getElementById('fireball-click-sound');
            clickSound.currentTime = 0; // Reset sound to start
            clickSound.volume=0.8;
            clickSound.play();

            if ('vibrate' in navigator) {
                navigator.vibrate(50); // 50ms vibration
            }
        }
    });

    document.getElementById('game-container').appendChild(object);
}

function moveObjects() {
    const objects = document.getElementsByClassName('falling-object');
    for (let object of objects) {
        const currentTop = parseFloat(object.style.top);
        object.style.top = `${currentTop + speed}px`;

        if (currentTop > window.innerHeight - 100) {
            loseHealth();
            object.remove(); // Remove the meteor
        }
    }
}

// Function to randomly spawn meteors
function startMeteorSpawn() {
    function spawnMeteor() {
        if (!isGameOver) {
            createFallingObject();
            
            // Randomized spawn interval (between 50% and 150% of baseSpawnInterval)
            let randomInterval = Math.random() * (baseSpawnInterval * 1.5 - baseSpawnInterval * 0.5) + baseSpawnInterval * 0.5;
            
            setTimeout(spawnMeteor, randomInterval);
        }
    }
    spawnMeteor();
}

function loseHealth() {
    if (health > 0) {
        let heart = document.getElementById(`heart${health}`);
        
        // Apply shake effect
        heart.classList.add("shake");
        heart.classList.add("bounce");


        // Wait for shake animation to complete, then fade out
        setTimeout(() => {
            heart.style.opacity = "0.2"; // Fade out heart
            heart.classList.remove("shake"); // Remove shake class after animation
            heart.classList.remove("bounce"); // Remove bounce class after animation

        }, 500);

        health--;
        speed *= speedReductionFactor; // Slow down the game a bit

        if (health === 0) {
            endGame();
        }
    }
}



function increaseSpeed() {
    speed += Math.random() * 1.5 + 0.5;;
    // Increase points and spawn rate
    pointsPerFireball += 2;
    baseSpawnInterval = Math.max(300, baseSpawnInterval - (Math.random() * 100 + 100)); // Reduce by 100-200ms

    //clearInterval(gameInterval);
    //gameInterval = setInterval(createFallingObject, baseSpawnInterval);
    console.log(`Speed: ${speed}px/frame | Points: +${pointsPerFireball} | Spawn: ${baseSpawnInterval}ms`);

}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(moveInterval);
    clearInterval(speedIncreaseInterval);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('end-high-score').textContent = highScore;
    document.getElementById('trex').classList.remove('running', 'running-reverse');
    document.getElementById('trex').style.display = 'none';

    //ad banner shows now
    //document.getElementById('ad-banner').style.display = 'block';


    // Stop fireball sound
    document.getElementById('fireball-sound').pause();
    // Stop T-Rex running sound
    document.getElementById('trex-running-sound').pause();

}

function startGame() {
    // Reset game state
    isGameOver = false;
    score = 0;
    speed = 5;
    pointsPerFireball = 5; // Reset points
    baseSpawnInterval = 1000; // Reset spawn interval
    isMovingRight = true;

    //hide the ad banner
    //document.getElementById('ad-banner').style.display = 'none';

    // Show game container
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById("start-menu").style.animation = "fadeOut 0.8s ease-in-out forwards";

    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('trex').style.display = 'block';
    document.getElementById('score-board').textContent = 'Score: 0';
    document.getElementById('health-bar').style.display = 'flex';
    let heart = document.getElementById(`heart${health}`);
    heart.classList.add("bounce");

    startMeteorSpawn();

    // Start T-Rex animation
    const trex = document.getElementById('trex');
    trex.classList.add('running');
    trex.style.transform = 'scaleX(1)';

    //trex sound will add if necessary in future
    // const runningSound = document.getElementById('trex-running-sound');
    // runningSound.currentTime = 0; // Reset sound to start
    // runningSound.play(); 
    
    // Clear existing objects
    const objects = document.getElementsByClassName('falling-object');
    while(objects.length > 0) objects[0].remove();

    
    // Start game loops
    //gameInterval = setInterval(createFallingObject, 1000);
    moveInterval = setInterval(moveObjects, 30);
    speedIncreaseInterval = setInterval(increaseSpeed, 15000);

    const fireSound = document.getElementById('fireball-sound');
    fireSound.currentTime = 0; // Reset sound to start
    fireSound.volume=0.1;
    fireSound.play();

    //for health bars
    health = 3;
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`heart${i}`).style.opacity = "1"; // Restore all hearts
    }
}


// Initialize game
document.getElementById('high-score').textContent = highScore;
document.getElementById('game-container').style.display = 'none';

/*
//Add this to automatically adjust height when u add ads
window.addEventListener('load', () => {
    const adBanner = document.getElementById('ad-banner');
    const adContent = document.querySelector('.ad-content');
    
    // Set banner height to match ad content
    adBanner.style.height = `${adContent.offsetHeight}px`;
    
    // Update on window resize
    window.addEventListener('resize', () => {
        adBanner.style.height = `${adContent.offsetHeight}px`;
    });
}); */