const config = {
    type: Phaser.AUTO,
    width: 300,
    height: 300,
    parent: "slot-machine",
    backgroundColor: "#000",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "🔔"];
let reels = [];
let spinning = false;
let attempts = 10;
let playerName = "";

document.getElementById("startGame").addEventListener("click", startGame);

function startGame() {
    playerName = document.getElementById("playerName").value.trim();
    if (playerName === "") {
        alert("Digite um nome para começar!");
        return;
    }

    document.getElementById("playerInfo").textContent = `Jogador: ${playerName}`;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
}

function preload() {}

function create() {
    let centerX = this.cameras.main.width / 2;
    let centerY = this.cameras.main.height / 2;

    // Criando linhas extras para simular um slot real
    createReelRow(this, centerX, centerY - 60); // Linha superior
    createReelRow(this, centerX, centerY);       // Linha do meio (principal)
    createReelRow(this, centerX, centerY + 60); // Linha inferior

    document.getElementById("spinButton").addEventListener("click", () => spinReels(this));
}

function update() {}

// Criando linha do slot
function createReelRow(scene, centerX, yPosition) {
    let row = [];
    for (let i = 0; i < 3; i++) {
        let text = scene.add.text(centerX - 80 + i * 80, yPosition, getRandomSymbol(), {
            fontSize: "48px",
            color: "#ffcc00",
            fontFamily: "Arial"
        });
        text.setOrigin(0.5);
        row.push(text);
    }
    reels.push(row);
}

// Função para girar os rolos
function spinReels(scene) {
    if (spinning || attempts <= 0) return;
    spinning = true;
    attempts--;

    document.getElementById("attemptCount").textContent = attempts;

    let spinTime = 1000;
    let interval = 100;

    let spinInterval = setInterval(() => {
        reels.forEach(row => row.forEach(reel => reel.setText(getRandomSymbol())));
    }, interval);

    setTimeout(() => {
        clearInterval(spinInterval);
        spinning = false;

        let result = reels[1].map(reel => reel.text); // Pegamos apenas a linha do meio
        checkWin(result);
    }, spinTime);
}

// Função para obter um símbolo aleatório
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Verifica se o jogador ganhou
function checkWin(result) {
    let message = document.getElementById("resultMessage");

    if (result[0] === result[1] && result[1] === result[2]) {
        message.textContent = `🎉 JACKPOT! Parabéns, ${playerName}! Você ganhou! 🎉`;
        message.style.color = "#00ff00";
    } else {
        message.textContent = `😢 ${playerName}, tente novamente!`;
        message.style.color = "#ff0000";
    }
}
