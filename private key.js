const express = require('express');
const Stripe = require('stripe');
const Decimal = require('decimal.js');
const bodyParser = require('body-parser');

const app = express();
const stripe = Stripe(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); // KEEP THIS SECRET

// Configure Decimal for 18-place precision
Decimal.set({ precision: 50 });

// TREASURY SETTINGS
const GOLD_PRICE = new Decimal("75.42");
const TOTAL_SUPPLY = new Decimal("6000000000000000000"); // 6 Quintillion

// Simulated Ledger (Use a database like PostgreSQL for a real site)
let treasuryReserve = new Decimal("6000000000000000000");
let cashLiquidity = new Decimal("100000000000.00"); // $100B
let userBalances = {};

app.use(express.static('public')); // Serves your HTML file
app.use(bodyParser.json());

// ROUTE: Create Stripe Session (Visa/Mastercard)
app.post('/buy-sqos', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'SQ-OS Digital Currency', description: 'Gold-Pegged Treasury Unit' },
                    unit_amount: 10000, // $100.00 USD
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('SQ-OS Treasury Server running on port 3000'));