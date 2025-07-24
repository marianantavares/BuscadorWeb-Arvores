import { KeywordTrie } from '../tree/KeywordTrie.js';

export function SearchPanel() {
  const section = document.createElement('section');
  section.className = 'search-panel';

  const title = document.createElement('h2');
  title.textContent = 'Buscar Conteúdo';
  section.appendChild(title);

  const form = document.createElement('form');
  form.className = 'search-form';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Digite palavra-chave...';
  input.required = true;
  form.appendChild(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Buscar';
  form.appendChild(button);

  const resultDiv = document.createElement('div');
  resultDiv.className = 'search-results';
  section.appendChild(form);
  section.appendChild(resultDiv);

  form.onsubmit = (e) => {
    e.preventDefault();
    const keywords = input.value.trim().toLowerCase().split(/\s+/);
    const results = KeywordTrie.searchMultiple(keywords);
    resultDiv.innerHTML = '';
    if (results.length === 0) {
      resultDiv.textContent = 'Nenhum resultado encontrado.';
    } else {
      results.forEach(page => {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `<strong>${page.title}</strong><br><a href="${page.url}" target="_blank">${page.url}</a>`;
        resultDiv.appendChild(item);
      });
    }
  };

  return section;
}
