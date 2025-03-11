let backgroundMusic;
let leverSound;
let symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "🔔"];
let reels = [[], [], []]; // Agora temos três linhas
let spinning = false;
let playerName = "";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startGame").addEventListener("click", startGame);
    document.getElementById("playMusic").addEventListener("click", playBackgroundMusic);
    document.getElementById("spinButton").addEventListener("click", spinReels);

    // Inicializa os sons
    backgroundMusic = new Audio("assets/sounds/fundo.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

    leverSound = new Audio("assets/sounds/botao.mp3");
});

function startGame() {
    playerName = document.getElementById("playerName").value.trim();
    if (playerName === "") {
        alert("Digite um nome para começar!");
        return;
    }

    // Esconder a tela inicial e mostrar o jogo
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");

    createReels();
}

function playBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        document.getElementById("playMusic").textContent = "🔇 Pausar Música";
    } else {
        backgroundMusic.pause();
        document.getElementById("playMusic").textContent = "🎵 Ativar Música";
    }
}

function createReels() {
    let slotMachine = document.getElementById("slot-machine");
    slotMachine.innerHTML = "";

    for (let row = 0; row < 3; row++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("reel-row");

        for (let i = 0; i < 3; i++) {
            let column = document.createElement("div");
            column.classList.add("reel");
            column.textContent = getRandomSymbol();
            rowDiv.appendChild(column);
            reels[row].push(column);
        }

        slotMachine.appendChild(rowDiv);
    }
}

function spinReels() {
    if (spinning) return;
    spinning = true;

    // Toca o som do botão girar
    leverSound.play();

    document.getElementById("resultMessage").textContent = "🎰 Girando...";

    // Tempo aleatório entre 2,2s (2200ms) e 3,2s (3200ms)
    let spinTime = Math.floor(Math.random() * 1000) + 2200;

    let interval = setInterval(() => {
        reels.forEach(row => row.forEach(reel => reel.textContent = getRandomSymbol()));
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        spinning = false;

        let result = reels[1].map(reel => reel.textContent); // Pegamos apenas a linha do meio
        checkWin(result);
    }, spinTime);
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function checkWin(result) {
    let message = document.getElementById("resultMessage");

    if (result[0] === result[1] && result[1] === result[2]) {
        message.textContent = `🎉 JACKPOT! ${playerName}, você ganhou! 🎉`;
        message.style.color = "#00ff00";
    } else {
        message.textContent = `😢 ${playerName}, tente novamente!`;
        message.style.color = "#ff0000";
    }
}
