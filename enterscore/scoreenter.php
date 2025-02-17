<?php
session_start();
$conn = new mysqli("localhost", "root", "", "aim_trainer_db");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Checks if the fetch sent the scores and times correctly, i don't think 
//we need the score but its more of used to like verify
//Whether or not user permitted the entry or smt, like a simple way
//So uhh yeah imma stop yapping
if (isset($_POST['submit_score']) && isset($_SESSION['user_id']) && isset($_POST['elapsed_time'])) {
    $score = (int)$_POST['elapsed_time']; // Time in milliseconds
    $user_id = $_SESSION['user_id'];
    //sql to enter the thing
    $stmt = $conn->prepare("INSERT INTO scores (user_id, score) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $score);

    if ($stmt->execute()) {
        echo "success"; // send text success to JavaScript
    } else {
        echo "error".$conn->error; // Signal database error and send the error and the actual error
    }
    $stmt->close();
} else {
    echo "not_logged_in" ; //not logged in, does this most of the time if u directly enter the page
}
$conn->close();
?>
