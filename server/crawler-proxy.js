// Servidor Node.js unificado - Proxy de crawler + Arquivos estáticos
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API do crawler
app.get('/crawl', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'URL obrigatória' });
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    res.json({ html });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar a página.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor BuscadorWeb rodando em http://localhost:${PORT}`);
  console.log(`📁 Servindo arquivos estáticos e API do crawler`);
});
