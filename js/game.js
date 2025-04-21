let backgroundMusic;
let leverSound;
let symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "🔔"];
let reels = [[], [], []];
let spinning = false;
let currentUser = null;

// Custo por jogada
const SPIN_COST = 10;
// Prêmio por vitória
const WIN_AMOUNT = 50;

document.addEventListener("DOMContentLoaded", () => {
    // Verificar autenticação
    checkAuth();

    // Carregar dados do usuário
    loadUserData();

    // Configurar event listeners
    document.getElementById("playMusic").addEventListener("click", playBackgroundMusic);
    document.getElementById("spinButton").addEventListener("click", spinReels);

    // Inicializar sons
    backgroundMusic = new Audio("assets/sounds/fundo.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;

    leverSound = new Audio("assets/sounds/botao.mp3");

    // Criar slots
    createReels();
});

function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        document.getElementById('playerName').textContent = currentUser.name;
        document.getElementById('playerCredits').textContent = currentUser.credits;
        
        // Carregar histórico
        loadHistory();
    }
}

function updateCredits(amount) {
    currentUser.credits += amount;
    document.getElementById('playerCredits').textContent = currentUser.credits;
    
    // Atualizar no localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function loadHistory() {
    const history = localStorage.getItem(`history_${currentUser.email}`) || '[]';
    const gameHistory = JSON.parse(history);
    
    const historyContainer = document.getElementById('gameHistory');
    historyContainer.innerHTML = gameHistory
        .slice(-10) // Mostrar apenas as últimas 10 jogadas
        .reverse() // Mostrar mais recentes primeiro
        .map(item => `
            <div class="history-item ${item.won ? 'history-win' : 'history-lose'}">
                ${item.result} - ${item.won ? '+' + WIN_AMOUNT : '-' + SPIN_COST} créditos
            </div>
        `)
        .join('');
}

function addToHistory(result, won) {
    const historyItem = {
        result,
        won,
        timestamp: new Date().toISOString()
    };
    
    const history = JSON.parse(localStorage.getItem(`history_${currentUser.email}`) || '[]');
    history.push(historyItem);
    localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(history));
    
    loadHistory();
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
    
    // Verificar se tem créditos suficientes
    if (currentUser.credits < SPIN_COST) {
        document.getElementById("resultMessage").textContent = "❌ Créditos insuficientes!";
        document.getElementById("resultMessage").style.color = "#ff4444";
        return;
    }

    spinning = true;
    
    // Deduzir custo da jogada
    updateCredits(-SPIN_COST);

    // Desabilitar botão durante o giro
    const spinButton = document.getElementById("spinButton");
    spinButton.disabled = true;

    // Toca o som do botão girar
    leverSound.play();

    document.getElementById("resultMessage").textContent = "🎰 Girando...";
    document.getElementById("resultMessage").style.color = "white";

    // Tempo aleatório entre 2,2s e 3,2s
    let spinTime = Math.floor(Math.random() * 1000) + 2200;

    let interval = setInterval(() => {
        reels.forEach(row => row.forEach(reel => reel.textContent = getRandomSymbol()));
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        spinning = false;
        spinButton.disabled = false;

        let result = reels[1].map(reel => reel.textContent);
        checkWin(result);
    }, spinTime);
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function checkWin(result) {
    let message = document.getElementById("resultMessage");
    const resultString = result.join(' ');
    
    if (result[0] === result[1] && result[1] === result[2]) {
        // Vitória
        updateCredits(WIN_AMOUNT);
        message.textContent = `🎉 JACKPOT! Você ganhou ${WIN_AMOUNT} créditos! 🎉`;
        message.style.color = "#00ff00";
        addToHistory(resultString, true);
    } else {
        message.textContent = `😢 Tente novamente!`;
        message.style.color = "#ff0000";
        addToHistory(resultString, false);
    }
}
