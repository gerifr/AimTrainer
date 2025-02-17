<?php
session_start();
$conn = new mysqli("localhost", "root", "", "aim_trainer_db");

// This wil execute once user presses the login button and basically check if id and pw is correct or not
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows > 0) {
        $user = $res->fetch_assoc();
        if (password_verify($password, $user['password'])) { 
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            //The above two lines will like uhh basically yk set session variables that other php pages can find
        } else {
            echo "<script>alert('Wrong password!');</script>";
        }
    } else {
        echo "<script>alert('User not found!');</script>";
    }
}

// If usr wants to register
if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);

    if ($stmt->execute()) {
        $_SESSION['user_id'] = $conn->insert_id;
        $_SESSION['username'] = $username;
    } else {
        echo "<script>alert('Username already taken!');</script>";
    }
}
// Get leaderboard from the server actually it gets all and is very bad when scared to a large extent but who cares
$leaderboard = $conn->query("SELECT users.username, scores.score 
    FROM scores JOIN users ON scores.user_id = users.id 
    ORDER BY scores.score ASC LIMIT 10");

// Fetch user runs, again its very very bad if user has a lotta things, atleast I think so dunno rlly, haven't port forwarded it yet and will not be commenting again once I do it
$user_scores = null;
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $user_scores = $conn->query("SELECT score FROM scores WHERE user_id='$user_id' ORDER BY score ASC");
}

// The html part

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AimInGame </title>
    <link rel="icon" type="image/jpeg" href="data:image/png;base64,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">
    <link rel="stylesheet" href="./styles/style.css">
</head> 
<body onload="startup();">
    <div class="wrapper">
        <!-- Left Side: Login/Register -->
        <div class="login-box">
            <?php if (!isset($_SESSION['user_id'])): ?>
                <h2>Login/Register</h2>
                <form method="POST" id="loginForm">
                    <input type="text" name="username" placeholder="Username" required><br>
                    <input type="password" name="password" placeholder="Password" required><br>
                    <button type="submit" name="login">Login</button>
                    <button type="submit" name="register" id="registerBtn">Register</button>
                </form>
            <?php else: ?>
                <h3>Welcome, <?= htmlspecialchars($_SESSION['username']); ?>!</h3>

                <!-- User Personal Runs -->
                <h3>Your Runs</h3>
                <table border="1" width="100%">
                    <tr><th>#</th><th>Score</th></tr>
                    <?php 
                    if ($user_scores && $user_scores->num_rows > 0): 
                        $rank = 1;
                        while ($row = $user_scores->fetch_assoc()): ?>
                            <tr>
                                <td><?= $rank++; ?></td>
                                <td><?= gmdate("H:i:s", $row['score'] / 1000) . '.' . str_pad($row['score'] % 1000, 3, "0", STR_PAD_LEFT); ?></td>
                            </tr>
                        <?php endwhile;
                    else: ?>
                        <tr><td colspan="2">No runs recorded yet.</td></tr>
                    <?php endif; ?>
                </table> 

                <form method="POST"><button type="submit" name="logout">Logout</button></form>
            <?php endif; ?>
        </div>

        <div class="game-container">
            <!-- Top Bar with Buttons -->
            <div class="top-bar">
                <button id="startBtn">Start</button>
                <button id="pauseBtn">Pause</button>
                <button id="resumeBtn" disabled>Resume</button>
                <button id="resetBtn">Reset</button>
                <select id="difficulty">
                    <option value="2000">Super Easy (2 sec)</option>
                    <option value="1000">Easy (1 sec)</option>
                    <option value="500">Medium (0.5 sec)</option>
                    <option value="300">Hard (0.3 sec)</option>
                    <option value="100">The Asian (0.1 sec)</option>
                </select>
                <select id="mode">
                    <option value="10">10 points</option>
                    <option value="30">30 points</option>
                    <option value="50">50 points</option>
                    <option value="1000000000000000">Practice</option>
                </select>
                &nbsp;
                <div id="scoreDisplay">Score: <span id="score-value">0</span></div> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div id="timerDisplay">Timer: <span id="timecount">0</span></div>
            </div>

            <!-- Game Box -->
            <div class="game-box">
                <canvas id="gameCanvas"></canvas>
            </div>
        </div>

        <!-- Right Side: Leaderboard -->
        <div class="right">
            <h2>Leaderboard</h2>
            <table border="1" width="100%">
                <tr><th>Username</th><th>Score</th></tr>
                <?php while ($row = $leaderboard->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['username']); ?></td>
                        <td><?= gmdate("H:i:s", $row['score'] / 1000) . '.' . str_pad($row['score'] % 1000, 3, "0", STR_PAD_LEFT); ?></td>
                    </tr>
                <?php endwhile; ?>
            </table>
        </div>
    </div>
    <script src="./js/main.js"></script>
</body>
</html>

<?php
// Handle logout
if (isset($_POST['logout'])) {
    session_destroy();
    echo "<script>window.location.href='index.php';</script>";
}
?>
