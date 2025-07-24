import { KeywordTrie } from '../tree/KeywordTrie.js';

export function PageForm() {
  const section = document.createElement('section');
  section.className = 'page-form';

  const title = document.createElement('h2');
  title.textContent = 'Cadastrar Página/Conteúdo';
  section.appendChild(title);

  const form = document.createElement('form');
  form.className = 'add-form';

  const inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.placeholder = 'Título da página';
  inputTitle.required = true;
  form.appendChild(inputTitle);

  const inputUrl = document.createElement('input');
  inputUrl.type = 'url';
  inputUrl.placeholder = 'URL da página';
  inputUrl.required = true;
  form.appendChild(inputUrl);

  const inputKeywords = document.createElement('input');
  inputKeywords.type = 'text';
  inputKeywords.placeholder = 'Palavras-chave (separadas por espaço)';
  inputKeywords.required = true;
  form.appendChild(inputKeywords);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Adicionar';
  form.appendChild(button);

  const msg = document.createElement('div');
  msg.className = 'form-msg';
  section.appendChild(form);
  section.appendChild(msg);

  form.onsubmit = (e) => {
    e.preventDefault();
    const page = {
      title: inputTitle.value.trim(),
      url: inputUrl.value.trim(),
      keywords: inputKeywords.value.trim().toLowerCase().split(/\s+/)
    };
    KeywordTrie.insertPage(page);
    msg.textContent = 'Página adicionada com sucesso!';
    form.reset();
    setTimeout(() => msg.textContent = '', 2000);
    document.dispatchEvent(new Event('treeUpdated'));
  };

  return section;
}
