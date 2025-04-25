const express = require('express');
const path = require('path');
const mercadopago = require('mercadopago');
const cors = require('cors');
const app = express();

// Definir PORT antes de usar
const PORT = 5500;

// Configurar CORS com opções específicas
app.use(cors({
    origin: function(origin, callback) {
        // Permitir requisições de localhost:5500 e 127.0.0.1:5500
        const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Mercado Pago com as credenciais corretas
mercadopago.configure({
    access_token: 'APP_USR-2554683912392134-042323-c3078b8e3dfaa538bee7966587adbc1a-1052469433',
    client_id: '2554683912392134',
    client_secret: '7ztZxhVEzlpEXSyrD79I2TDOGR4Si6yF'
});

// Webhook secret
const WEBHOOK_SECRET = '09af88f6ec6ffa88a942c1c23c4ac68dbebc041515c23281487102b6d79c5e33';

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Endpoint para criar preferência de pagamento
app.post('/create_preference', async (req, res) => {
    try {
        const { amount, description, user_email } = req.body;
        console.log('Dados recebidos:', { amount, description, user_email });

        if (!amount || !description || !user_email) {
            console.error('Dados inválidos:', { amount, description, user_email });
            return res.status(400).json({ error: 'Dados inválidos' });
        }

        const preference = {
            items: [{
                title: description,
                unit_price: Number(amount),
                quantity: 1,
                currency_id: 'BRL'
            }],
            payer: {
                email: user_email
            },
            back_urls: {
                success: `http://127.0.0.1:5500/payment_success.html`,
                failure: `http://127.0.0.1:5500/payment_failure.html`,
                pending: `http://127.0.0.1:5500/payment_pending.html`
            },
            auto_return: 'approved',
            notification_url: 'https://seu-webhook-url.com/webhook',
            statement_descriptor: 'SLOT MACHINE',
            external_reference: user_email,
            binary_mode: true
        };

        console.log('Criando preferência:', preference);

        const response = await mercadopago.preferences.create(preference);
        console.log('Resposta do Mercado Pago:', response.body);

        if (!response.body.id) {
            console.error('Resposta sem ID:', response);
            return res.status(500).json({ error: 'Erro ao criar preferência - sem ID' });
        }

        res.json({ 
            id: response.body.id,
            init_point: response.body.init_point
        });
    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ 
            error: 'Erro ao criar preferência de pagamento',
            details: error.message
        });
    }
});

// Endpoint para webhook do Mercado Pago
app.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-signature'];
        if (!signature || signature !== WEBHOOK_SECRET) {
            console.error('Assinatura inválida');
            return res.status(401).json({ error: 'Assinatura inválida' });
        }

        const { data } = req.body;
        console.log('Webhook recebido:', data);

        if (data.type === 'payment') {
            const paymentId = data.id;
            const payment = await mercadopago.payment.findById(paymentId);
            
            if (payment.status === 'approved') {
                const userEmail = payment.external_reference;
                const amount = payment.transaction_amount;
                
                // Aqui você pode atualizar os créditos do usuário
                console.log(`Pagamento aprovado: ${amount} para ${userEmail}`);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Mercado Pago configurado com access_token:', mercadopago.configurations.getAccessToken());
});
