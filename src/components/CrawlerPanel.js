import { KeywordTrie } from '../tree/KeywordTrie.js';

export function CrawlerPanel() {
  const section = document.createElement('section');
  section.className = 'crawler-panel';

  const title = document.createElement('h2');
  title.textContent = 'Automação: Crawler Simples';
  section.appendChild(title);

  const form = document.createElement('form');
  form.className = 'crawler-form';

  const inputUrl = document.createElement('input');
  inputUrl.type = 'url';
  inputUrl.placeholder = 'Informe a URL para coletar dados';
  inputUrl.required = true;
  form.appendChild(inputUrl);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Buscar e Sugerir';
  form.appendChild(button);

  const resultDiv = document.createElement('div');
  resultDiv.className = 'crawler-result';
  section.appendChild(form);
  section.appendChild(resultDiv);

  form.onsubmit = async (e) => {
    e.preventDefault();
    resultDiv.innerHTML = 'Buscando...';
    const url = inputUrl.value.trim();
    let pageTitle = url;
    let keywords = [];
    let fetched = false;
    try {
      // Usa o backend proxy para buscar o HTML da página
      const response = await fetch(`http://localhost:3001/crawl?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.html) {
        const match = data.html.match(/<title>(.*?)<\/title>/i);
        pageTitle = match ? match[1] : url;
        fetched = true;
      } else {
        throw new Error('Sem HTML');
      }
    } catch (err) {
      // Simula coleta caso fetch falhe (CORS ou proxy offline)
      pageTitle = 'Página Exemplo de ' + (new URL(url)).hostname.replace('www.', '');
    }
    // Sugere palavras-chave do título e domínio
    const domain = (new URL(url)).hostname.replace('www.', '');
    keywords = [
      ...pageTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3),
      ...domain.split('.')
    ];
    // Monta formulário de confirmação
    resultDiv.innerHTML = '';
    const labelTitle = document.createElement('label');
    labelTitle.textContent = 'Título:';
    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.value = pageTitle;
    resultDiv.appendChild(labelTitle);
    resultDiv.appendChild(inputTitle);
    resultDiv.appendChild(document.createElement('br'));
    const labelKeywords = document.createElement('label');
    labelKeywords.textContent = 'Palavras-chave:';
    const inputKeywords = document.createElement('input');
    inputKeywords.type = 'text';
    inputKeywords.value = Array.from(new Set(keywords)).join(' ');
    resultDiv.appendChild(labelKeywords);
    resultDiv.appendChild(inputKeywords);
    resultDiv.appendChild(document.createElement('br'));
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Salvar no índice';
    saveBtn.type = 'button';
    resultDiv.appendChild(saveBtn);
    saveBtn.onclick = () => {
      const page = {
        title: inputTitle.value.trim(),
        url,
        keywords: inputKeywords.value.trim().toLowerCase().split(/\s+/)
      };
      KeywordTrie.insertPage(page);
      resultDiv.innerHTML = 'Página coletada e salva!';
      inputUrl.value = '';
      document.dispatchEvent(new Event('treeUpdated'));
    };
    if (!fetched) {
      const info = document.createElement('div');
      info.style.color = 'orange';
      info.style.marginTop = '8px';
      info.textContent = 'Obs: coleta simulada devido a restrição de CORS do navegador.';
      resultDiv.appendChild(info);
    }
  };

  return section;
}
