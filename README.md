# 🎰 Slot Machine Game

Um jogo de caça-níqueis interativo desenvolvido com HTML, CSS e JavaScript puro, incluindo sistema de login, gerenciamento de créditos e histórico de jogadas.

## 📋 Funcionalidades

### 🔐 Sistema de Autenticação
- Cadastro de novos usuários
- Login com email e senha
- Persistência de dados com localStorage
- Proteção de rotas (acesso ao jogo apenas para usuários logados)

### 💰 Sistema de Créditos
- 1000 créditos iniciais para novos usuários
- Custo de 10 créditos por jogada
- Prêmio de 50 créditos por vitória
- Acompanhamento em tempo real dos créditos

### 🎮 Gameplay
- Três linhas de slots com símbolos diferentes
- Animações suaves durante os giros
- Efeitos sonoros (música de fundo e som de alavanca)
- Sistema de vitória baseado em combinações iguais

### 📊 Recursos Adicionais
- Histórico das últimas 10 jogadas
- Indicadores visuais de vitória/derrota
- Interface responsiva e moderna
- Feedback visual para todas as ações

## 🚀 Como Jogar

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/jogo-slots.git
```

2. Abra o arquivo `index.html` em seu navegador

3. Crie uma nova conta ou faça login

4. Comece a jogar!
   - Cada jogada custa 10 créditos
   - Combine 3 símbolos iguais para ganhar 50 créditos
   - Acompanhe seu histórico de jogadas

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage para persistência de dados
- Web Audio API para efeitos sonoros

## 📱 Compatibilidade

O jogo é compatível com os seguintes navegadores:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

## 🎨 Estrutura do Projeto

```
jogo-slots/
├── css/
│   ├── auth.css    # Estilos do sistema de autenticação
│   └── game.css    # Estilos do jogo
├── js/
│   ├── auth.js     # Lógica de autenticação
│   └── game.js     # Lógica do jogo
├── assets/
│   └── sounds/     # Efeitos sonoros
├── index.html      # Página de login
├── register.html   # Página de cadastro
└── game.html       # Página do jogo
```

## 🔄 Atualizações Futuras

- [ ] Ranking de jogadores
- [ ] Mais combinações de prêmios
- [ ] Níveis de dificuldade
- [ ] Modo multiplayer
- [ ] Achievements/conquistas
- [ ] Temas personalizáveis
- [ ] Backup em nuvem dos dados

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎮 Demo

Você pode jogar uma versão demo do jogo [aqui](https://seu-usuario.github.io/jogo-slots).

---
⌨️ com ❤️ por [Seu Nome](https://github.com/seu-usuario)
