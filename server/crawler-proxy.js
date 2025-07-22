// Servidor Node.js para proxy de crawler
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

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
  console.log(`Crawler proxy rodando em http://localhost:${PORT}`);
});
