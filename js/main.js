const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
let balloons = []; 
let gameInterval;
let isPaused = false;
let score = 0;
let determinedscore = 0;
let startTime, elapsedTime = 0, timerInterval;
let timer = 1000; 
const sound = new Audio("./sound/pop.mp3"); 
sound.volume=0.5;
function playSound() {
    sound.currentTime = 0; // Reset to start
    sound.play();
    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0; // Reset so it plays from start next time
    }, 500);
}
// Function to update the time
function updateTimer() {
    let currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    let totalMilliseconds = elapsedTime % 1000;
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    document.getElementById('timecount').innerText =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(totalMilliseconds).padStart(3, "0")}`;
}
// Start timer
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 10);
}
// Pause timer
function pauseTimer() {
    clearInterval(timerInterval);
}
// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById('timecount').innerText = "00:00:00.000";
}
function makedefault(){
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resumeBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('difficulty').disabled = false;
    document.getElementById('mode').disabled = false;
}
// Startup function
function startup() {
    makedefault()
    resetTimer();
}
// Spawn and draw balloon
function spawnAndDrawBalloon() {
    if (isPaused) return;
    balloons = []; // Clear any existing balloons
    const x = Math.random() * (canvas.width - 40) + 20;
    const y = Math.random() * (canvas.height - 40) + 20;
    const radius = 15;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    balloons.push({ x, y, radius, color });

    setTimeout(() => {
        if (!isPaused && balloons.length > 0) {
            balloons = []; 
            spawnAndDrawBalloon();
        }
    }, timer);

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
    draw();
}
// Adjusted click detection logic for better accuracy
canvas.addEventListener('click', (event) => {
    if (isPaused || balloons.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    const balloon = balloons[0];
    const dx = balloon.x - mouseX;
    const dy = balloon.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= balloon.radius) {
        score++; 
        playSound();
        document.getElementById('score-value').innerText = score;
        balloons = [];
        if (score === determinedscore) {
            let formData = new FormData();
            formData.append("submit_score", "1");
            formData.append("elapsed_time", elapsedTime);
            fetch("./enterscore/scoreenter.php", {
                method: "POST",
                body: formData,
                credentials: "include" 
            })
            .then(response => response.text())
            .then(data => {
                if (data.trim() === "success") {
                    alert("✅ Score saved successfully!");
                    window.location.href = window.location.href;
                } else {
                    alert("⚠️ You are not logged in. Your score was NOT saved." + data.trim());
                }
            })
            .catch(error => console.error("Error submitting score:", error));
            isPaused = false;
            clearInterval(gameInterval);
            gameInterval = null;
            balloons = [];
            score = 0;
            makedefault();
            resetTimer();
        }
    }
});
// Start button event
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameInterval) {
        timer = parseInt(document.getElementById('difficulty').value);
        determinedscore = parseInt(document.getElementById('mode').value);
        spawnAndDrawBalloon();
        gameInterval = setInterval(spawnAndDrawBalloon, timer);
        startTimer();
    }
    document.getElementById('mode').disabled = true;
    document.getElementById('difficulty').disabled = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
});
// Pause button event
document.getElementById('pauseBtn').addEventListener('click', () => {
    isPaused = true;
    pauseTimer();
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resumeBtn').disabled = false;
});
// Resume button event
document.getElementById('resumeBtn').addEventListener('click', () => {
    isPaused = false;
    startTimer();
    if (balloons.length === 0) spawnAndDrawBalloon();
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('resumeBtn').disabled = true;
});
// Reset button event
document.getElementById('resetBtn').addEventListener('click', () => {
    isPaused = false;
    clearInterval(gameInterval);
    gameInterval = null;
    balloons = [];
    score = 0;
    makedefault();
    resetTimer();
});

// Initialize
startup();
