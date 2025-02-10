const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let balloons = []; // Only one balloon at a time
let gameInterval;
let isPaused = false;
let score = 0;
let determinedscore= 0
let startTime,elapsedTime=0,timerInterval;
let timer = 1000; // Balloon lifespan

//Update time, should be called on certain intervals
function updateTimer() {
    let currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    document.getElementById('timecount').innerText =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

//Start timer
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
}

//Pause time 
function pauseTimer() {
    clearInterval(timerInterval);
}

// Reset timer:
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById('timecount').innerText = "00:00:00";
}

// Function to work at startup  to like disable stuff that isn't needed
function startup(){
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resumeBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('difficulty').disabled = false;
    document.getElementById('mode').disabled
    resetTimer();
}

//Function to spawn and draw the ballon randomly somewhere in the screen
function spawnAndDrawBalloon() {
    if (isPaused) return;
    // Spawn a new balloon
    balloons = []; //Clears any existing baloon ( don't prolly exist but still)

    const x = Math.random() * (canvas.width - 40) + 20;
    const y = Math.random() * (canvas.height - 40) + 20;
    const radius = 20;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    balloons.push({ x, y, radius, color });

    // Remove baloon after the timer duration , specified according to difficulty
    setTimeout(() => {
        if (!isPaused && balloons.length > 0) {
            balloons = [];
            spawnAndDrawBalloon(); // Spawn next balloon
        }
    }, timer);

    // Draw the balloon inside the same function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (balloons.length > 0) {
            const balloon = balloons[0];
            ctx.beginPath();
            ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
            ctx.fillStyle = balloon.color;
            ctx.fill();
            ctx.closePath();
        }
        requestAnimationFrame(draw);
    }
    draw(); // Start the drawing loop
}

// Register clicks
canvas.addEventListener('click', (event) => {
    if (isPaused) return;
    if (balloons.length === 0) return; // No balloon to click

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const balloon = balloons[0]; // There's only one balloon
    const dx = balloon.x - mouseX;
    const dy = balloon.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= balloon.radius) {
        score++; // Increase score
        if(score== determinedscore){
                ///////// HAVE YET TO ADD LIKE YK THE YOU WON LOGIN PAGE KINDA SHIT, AT THIS POINT WE WANNA 
                //SAVE THE SHIT BITCHES
            isPaused = false;
            clearInterval(gameInterval);
            gameInterval = null;
            balloons = [];
            score = 0;
            document.getElementById('score-value').innerText = score;
            document.getElementById('mode').disabled=false;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
            document.getElementById('resumeBtn').disabled = true;
            document.getElementById('resetBtn').disabled = true;
            document.getElementById('difficulty').disabled = false;
            resetTimer() 
        }
            document.getElementById('score-value').innerText = score;
            balloons = []; // Remove balloon
    }
});

// BUTTONS

// Start Button
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameInterval) {
        timer = parseInt(document.getElementById('difficulty').value);
        determinedscore = parseInt(document.getElementById('mode').value);
        spawnAndDrawBalloon();
        gameInterval = setInterval(spawnAndDrawBalloon, timer);
        startTimer();
    }
    document.getElementById('mode').disabled=true;
    document.getElementById('difficulty').disabled = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
});

// Pause Button
document.getElementById('pauseBtn').addEventListener('click', () => {
    isPaused = true;
    pauseTimer(); // Pause the timer
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resumeBtn').disabled = false;
});

// Resume Button
document.getElementById('resumeBtn').addEventListener('click', () => {
    isPaused = false;
    startTimer(); // Resume the timer
    if (balloons.length === 0) spawnAndDrawBalloon(); // Resume with a balloon
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('resumeBtn').disabled = true;
});

// Reset Button
document.getElementById('resetBtn').addEventListener('click', () => {
    isPaused = false;
    clearInterval(gameInterval);
    gameInterval = null;
    balloons = [];
    score = 0;
    document.getElementById('score-value').innerText = score;
    document.getElementById('mode').disabled=false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resumeBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('difficulty').disabled = false;
    resetTimer(); 

});

// Start the animation loop
