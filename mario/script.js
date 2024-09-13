let board;
let boardWidth = 800; 
let boardHeight = 300;
let context;

// การตั้งค่าเกม
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
}
let gameOver = false;
let score = 0;
let time = 0;
let lives = 3; // จำนวนชีวิตปัจจุบัน
const totalLives = 3; // จำนวนชีวิตรวมที่สามารถเล่นได้

// การตั้งค่าอุปสรรค1
let boxImg;
let boxWidth = 40;
let boxHeight = 70;
let boxX = boardWidth;
let boxY = boardHeight - boxHeight;

// การตั้งค่าอุปสรรค2
let boxImg2;
let boxHeight2 = 100;

// การตั้งค่าอุปสรรค3
let boxImg3; 
let boxHeight3 = 80;

let boxesArray = [];
let boxSpeed = -5; // ความเร็วของกล่อง

// แรงโน้มถ่วง & ความเร็ว
let velocityY = 0;
let gravity = 0.25;
const maxVelocityY = 10; // ความเร็วสูงสุดในการตก

let heartImg; // ตัวแปรสำหรับหัวใจ

// เริ่มเกม
window.onload = function() {
    // แสดงผล
    board = document.getElementById('board'); 
    board.height = boardHeight; 
    board.width = boardWidth; 
    context = board.getContext('2d');

    // ผู้เล่น
    playerImg = new Image();
    playerImg.src = "mari.png"; 
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    // โหลดภาพกล่อง1
    boxImg = new Image();
    boxImg.src = "a2.png";

    // โหลดภาพกล่อง2
    boxImg2 = new Image();
    boxImg2.src = "a3.png";

    // โหลดภาพกล่อง3
    boxImg3 = new Image();
    boxImg3.src = "a4.png";

    // โหลดภาพหัวใจ
    heartImg = new Image();
    heartImg.src = "a5.png"; // เส้นทางของภาพดาว

    // เริ่มเกม
    startGame();

    // ฟังค์ชั่นสำหรับเหตุการณ์
    document.addEventListener("keydown", function(e) {
        if (!gameOver) {
            movePlayer(e);
        }
    });
}

let animationFrameId; // ตัวแปรเก็บ ID ของเฟรม

// ฟังก์ชันอัปเดต
function update() {
    if (gameOver) {
        context.clearRect(0, 0, board.width, board.height); 

        // ข้อความ "Game Over"
        context.font = "bold 50px Arial";
        context.textAlign = "center";
        context.fillStyle = "red";
        context.fillText("Game Over!", boardWidth / 2, boardHeight / 2 - 80);

        // ข้อความ "Score"
        context.font = "bold 30px Arial";
        context.fillStyle = "green";
        context.fillText("Score: " + score, boardWidth / 2, boardHeight / 2 - 30);

        // ข้อความ "Time"
        context.font = "bold 30px Arial";
        context.fillStyle = "blue";
        context.fillText("Time: " + time.toFixed(2), boardWidth / 2, boardHeight / 2 + 20);

        // ข้อความ "Life"
        context.font = "bold 30px Arial";
        context.fillStyle = "white";
        context.fillText("Life: " + lives, boardWidth / 2, boardHeight / 2 + 70);

        // ข้อความ "Refresh Page to Play Again"
        context.font = "italic 20px Arial";
        context.fillStyle = "black";
        context.fillText("Don't forget to refresh after dying 3 times.", boardWidth / 2, boardHeight / 2 + 120);
        
        return; // หยุดการทำงานของฟังก์ชันอัปเดต
    }

    animationFrameId = requestAnimationFrame(update); // เก็บ ID ของเฟรม

    context.clearRect(0, 0, board.width, board.height); 
    velocityY += gravity; 
    velocityY = Math.min(velocityY, maxVelocityY);

    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let i = 0; i < boxesArray.length; i++) {
        let box = boxesArray[i];
        box.x += boxSpeed; 
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            handleCollision();
            return; // หยุดการทำงานหากมีการชน
        }
    }

    boxesArray = boxesArray.filter(box => box.x + box.width > 0);

    score++;
    context.font = "normal bold 20px Arial";
    context.textAlign = "left";
    context.fillStyle = "green"; 
    context.fillText(" Score: " + score, 10, 30);

    time += 0.01; 
    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillStyle = "blue"; 
    context.fillText(" Time: " + time.toFixed(2), 785, 30);

    // แสดงชีวิตเป็นรูปหัวใจ
    const heartSize = 25; // ขนาดของหัวใจ
    const heartSpacing = 30; // ระยะห่างระหว่างหัวใจ
    const totalWidth = (lives - 1) * heartSpacing + heartSize; // ความกว้างรวมของหัวใจทั้งหมด

    let startX = boardWidth / 2 - totalWidth / 2; // จุดเริ่มต้น X ของหัวใจ

    for (let i = 0; i < lives; i++) {
        context.drawImage(heartImg, startX + i * heartSpacing, 10, heartSize, heartSize); // แสดงหัวใจ
    }

    checkTime();
}

// ฟังก์ชันจัดการการชนกับอุปสรรค
function handleCollision() {
    if (!gameOver) { // ตรวจสอบว่าเกมยังไม่จบ
        gameOver = true;
        cancelAnimationFrame(animationFrameId); // หยุดการอัปเดตเกม
        lives--;

        if (lives <= 0) {
            handleGameOver();
        } else {
            handleGameOver();
        }
    }
}

// ฟังก์ชันการเคลื่อนไหวของผู้เล่น
function movePlayer(e) {
    if (e.code === "Space" && player.y === playerY) { 
        velocityY = -8; 
    }
}

// ฟังก์ชันจัดการการชนกับอุปสรรค
function handleCollision() {
    // กำหนดสถานะเกมเป็น 'Game Over'
    gameOver = true;

    // หยุดการอัปเดตเกม
    cancelAnimationFrame(update);

    // ลดจำนวนชีวิต
    lives--;

    // หากชีวิตหมดแล้ว, รีเฟรชหน้าเว็บ
    if (lives <= 0) {
        handleGameOver();
    } else {
        // หากยังมีชีวิตเหลือให้เล่นได้
        handleGameOver();
    }
}

// ฟังก์ชันสร้างกล่องใหม่
function createBox() {
    if (gameOver) {
        return;
    }
    
    let boxImage = Math.random() < 0.33 ? boxImg : (Math.random() < 0.5 ? boxImg2 : boxImg3);
    let boxHeight = boxImage === boxImg ? 70 : (boxImage === boxImg2 ? boxHeight2 : boxHeight3); // กำหนดความสูงตามภาพที่เลือก
    
    let box = {
        img: boxImage,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };
    
    boxesArray.push(box);
    
    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

// ฟังก์ชันตรวจสอบการชนกันระหว่างสองวัตถุ
function onCollision(obj1, obj2) { 
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x && 
           obj1.y < (obj2.y + obj2.height) && 
           (obj1.y + obj1.height) > obj2.y; 
}

// ฟังก์ชันกำหนดเวลาการสร้างกล่องใหม่ (เงื่อนไข1)
function scheduleNextBox() {
    let minBoxInterval = 1000;
    let maxBoxInterval = 3000;
    let interval = Math.floor(Math.random() * (maxBoxInterval - minBoxInterval + 1)) + minBoxInterval;
    setTimeout(function() {
        if (!gameOver) {
            createBox();
            scheduleNextBox();
        }
    }, interval);
}

// ฟังก์ชันตรวจสอบว่าเวลาใช้ไปหมดหรือไม่ (เงื่อนไข2)
function checkTime() {
    if (time >= 60) { 
        gameOver = true; 
        handleGameOver(); // จัดการสิ้นสุดเกมเนื่องจากเวลา
    }
}

// ฟังก์ชันจัดการเกมโอเวอร์
function handleGameOver() {
    context.clearRect(0, 0, board.width, board.height); 

    // ข้อความ "Game Over"
    context.font = "bold 50px Arial";
    context.textAlign = "center";
    context.fillStyle = "red";
    context.fillText("Game Over!", boardWidth / 2, boardHeight / 2 - 80);

    // ข้อความ "Score"
    context.font = "bold 30px Arial";
    context.fillStyle = "green";
    context.fillText(" Score: " + score, boardWidth / 2, boardHeight / 2 - 30);

    // ข้อความ "Time"
    context.font = "bold 30px Arial";
    context.fillStyle = "blue";
    context.fillText(" Time: " + time.toFixed(2), boardWidth / 2, boardHeight / 2 + 20);

    // ข้อความ "Life"
    context.font = "bold 30px Arial";
    context.fillStyle = "white";
    context.fillText(" Life: " + lives, boardWidth / 2, boardHeight / 2 + 70);

    // ข้อความ "Refresh Page to Play Again"
    context.font = "italic 20px Arial";
    context.fillStyle = "black";
    context.fillText("Don't forget to refresh after dying 3 times.", boardWidth / 2, boardHeight / 2 + 120);

}

// ฟังก์ชันรีสตาร์ทเกม (เงื่อนไข3)
function handleRestart() {
    // ไม่ทำการรีสตาร์ทหากชีวิตหมด
    if (gameOver && lives > 0) {
        resetGame(); // รีเซ็ตเกม
    }
}

// ฟังก์ชันรีเซ็ตสถานะเกม
// ฟังก์ชันรีเซ็ตสถานะเกม
function resetGame() {
    gameOver = false;
    score = 0;
    time = 0;
    velocityY = 0;
    boxesArray = [];
    
    resetPlayerPosition();
    scheduleNextBox();
    update();
}

// ฟังก์ชันรีเซ็ตตำแหน่งของผู้เล่น
function resetPlayerPosition() {
    player.x = playerX;
    player.y = playerY;
}

// ฟังก์ชันเริ่มเกม
function startGame() {
    scheduleNextBox();
    update();
}
