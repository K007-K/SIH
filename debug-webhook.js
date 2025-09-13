const express = require('express');
const app = express();

// Add detailed logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  next();
});

app.use(express.json());

// Log all POST requests to webhook
app.post('/webhook', (req, res) => {
  console.log('=== WEBHOOK POST REQUEST ===');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('=== END WEBHOOK REQUEST ===');
  res.status(200).send('OK');
});

// Log all GET requests to webhook (verification)
app.get('/webhook', (req, res) => {
  console.log('=== WEBHOOK VERIFICATION ===');
  console.log('Query params:', req.query);
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('Mode:', mode);
  console.log('Token:', token);
  console.log('Expected token:', process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN);
  console.log('Challenge:', challenge);
  
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).json({ error: 'Verification failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔍 Debug webhook server running on port ${PORT}`);
  console.log(`📱 Use this URL for WhatsApp webhook: https://your-domain.com/webhook`);
});
