# 🎯 Aim Trainer Game  

A simple browser-based Aim Trainer game designed to improve accuracy and reflexes.  

## 🚀 Installation (for Linux)

Follow these steps to set up the project on your local machine:  

1. **Clone the repository**  
   ```sh
   git clone https://github.com/gerifr/AimTrainer 
   ```
2. **Navigate to the project directory**  
   ```sh
   cd aim-trainer
   ```
3. ***Set up the server (USING XAMPP)***:    
    <br>
    Move the project folder into `htdocs` (e.g., `C:/xampp/htdocs/AimTrainer`).  
    <br>
    Start Apache and MySQL from the XAMPP Control Panel.  
    <br>
    Go to [phpMyAdmin](http://localhost/phpmyadmin).  
    <br>
    Go to the SQL tab and run the following SQL code:  
    ```sql
    CREATE DATABASE aim_trainer_db; 
    USE aim_trainer_db; 
    CREATE TABLE scores(
        id INTEGER PRIMARY KEY AUTO_INCREMENT, 
        user_id INTEGER, 
        score INTEGER, 
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ); 
    CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTO_INCREMENT, 
        username VARCHAR(30), 
        password VARCHAR(100)
    );
    ```
4. ***Go to your project*** <br>
    You should be good to go to `http://localhost/AimTrainer/index.php` and play around with it.

---

## 🌎 Hosting It for Public Users  

To make your game publicly accessible, you can use **ngrok**.  

### 🐧 Linux / Mac  

1. **Install ngrok:**  
   ```sh
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && \
   sudo apt update && sudo apt install ngrok
   ```
2. **Start your local XAMPP or PHP server.**  
3. **Run ngrok to expose the local server:**  
   ```sh
   ngrok http 80
   ```

### 🖥️ Windows  

1. **Download ngrok** from [ngrok.com/download](https://ngrok.com/download).  
2. **Extract the downloaded file.**  
3. **Open Command Prompt or PowerShell**, navigate to the folder where ngrok is extracted, and run:  
   ```sh
   ngrok http 80
   ```
4. **Share the provided public URL** to allow others to access your game.  
