import { App } from './components/App.js';
// ...existing code...
import { KeywordTrie } from './tree/KeywordTrie.js';

// Dados de exemplo para demonstração
const exemploPaginas = [
  {
    title: 'Google',
    url: 'https://www.google.com',
    keywords: ['busca', 'web', 'pesquisa', 'google']
  },
  {
    title: 'Wikipedia',
    url: 'https://www.wikipedia.org',
    keywords: ['enciclopedia', 'conhecimento', 'web', 'wikipedia']
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com',
    keywords: ['video', 'entretenimento', 'web', 'youtube']
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    keywords: ['documentacao', 'web', 'desenvolvimento', 'mdn']
  },
  {
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    keywords: ['programacao', 'duvidas', 'web', 'stackoverflow']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Só insere dados de exemplo se não houver dados salvos
  const data = localStorage.getItem('buscadorweb_pages');
  if (!data) {
    exemploPaginas.forEach(p => KeywordTrie.insertPage(p));
  }
  document.getElementById('root').appendChild(App());
  document.dispatchEvent(new Event('treeUpdated'));
});
