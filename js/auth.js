// Função para gerenciar o armazenamento de usuários
const UserStorage = {
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    },

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },

    findUser(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }
};

// Função para validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para validar senha
function isValidPassword(password) {
    return password.length >= 6;
}

// Função para mostrar mensagem de erro
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Função para registrar novo usuário
function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validações
    if (!name || !email || !password || !confirmPassword) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Por favor, insira um email válido.');
        return;
    }

    if (!isValidPassword(password)) {
        showError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    if (password !== confirmPassword) {
        showError('As senhas não coincidem.');
        return;
    }

    if (UserStorage.findUser(email)) {
        showError('Este email já está cadastrado.');
        return;
    }

    // Criar novo usuário
    const user = {
        name,
        email,
        password,
        credits: 1000, // Créditos iniciais
        createdAt: new Date().toISOString()
    };

    // Salvar usuário
    UserStorage.saveUser(user);
    showSuccess('Cadastro realizado com sucesso!');

    // Redirecionar para login após 2 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Função para fazer login
function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    const user = UserStorage.findUser(email);

    if (!user || user.password !== password) {
        showError('Email ou senha incorretos.');
        return;
    }

    // Salvar sessão do usuário
    localStorage.setItem('currentUser', JSON.stringify({
        name: user.name,
        email: user.email,
        credits: user.credits
    }));

    // Redirecionar para o jogo
    window.location.href = 'game.html';
}

// Verificar se usuário está logado
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && window.location.pathname.includes('game.html')) {
        window.location.href = 'index.html';
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Adicionar event listeners quando o documento carregar
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    checkAuth();

    // Adicionar listeners aos formulários
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }
});
