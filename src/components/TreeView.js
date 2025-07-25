import { KeywordTrie } from '../tree/KeywordTrie.js';

export function TreeView() {
  const section = document.createElement('section');
  section.className = 'tree-view';

  const title = document.createElement('h2');
  title.textContent = 'Visualização da Árvore de Palavras-chave';
  section.appendChild(title);

  const treeDiv = document.createElement('div');
  treeDiv.className = 'tree-container';
  section.appendChild(treeDiv);

  function renderTree() {
    treeDiv.innerHTML = '';
    const root = KeywordTrie.getRoot();
    if (!root || Object.keys(root.children).length === 0) {
      treeDiv.textContent = 'Árvore vazia.';
      return;
    }
    treeDiv.appendChild(renderNode(root, []));
  }

  function renderNode(node, path) {
    const el = document.createElement('div');
    el.className = 'tree-node';
    if (node.keyword) {
      el.innerHTML = `<span class="keyword">${node.keyword}</span>`;
    }
    if (node.pages.length > 0) {
      const ul = document.createElement('ul');
      node.pages.forEach(page => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${page.title}</strong> 
          <a href="${page.url}" target="_blank">${page.url}</a> 
          <button class="edit-btn" data-url="${page.url}">Editar</button>
          <button class="remove-btn" data-url="${page.url}">Remover</button>
        `;
        // Remover
        li.querySelector('.remove-btn').onclick = () => {
          KeywordTrie.removePage(page.url, path.concat(node.keyword).filter(Boolean));
          document.dispatchEvent(new Event('treeUpdated'));
        };
        // Editar
        li.querySelector('.edit-btn').onclick = () => {
          showEditModal(page, path.concat(node.keyword).filter(Boolean));
        };
        ul.appendChild(li);
      });
  // Modal de edição
  function showEditModal(page, keywordsPath) {
    // Remove modal existente se houver
    const oldModal = document.getElementById('edit-modal-bg');
    if (oldModal) oldModal.remove();

    const modalBg = document.createElement('div');
    modalBg.className = 'modal-bg';
    modalBg.id = 'edit-modal-bg';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <h3>Editar Página</h3>
      <form class="edit-form">
        <label>Título:<br><input type="text" name="title" value="${page.title}" required></label><br>
        <label>URL:<br><input type="url" name="url" value="${page.url}" required></label><br>
        <label>Palavras-chave:<br><input type="text" name="keywords" value="${page.keywords.join(' ')}" required></label>
        <div class="modal-actions">
          <button type="submit">Salvar</button>
          <button type="button" class="close-btn">x</button>
        </div>
      </form>
    `;

    // Fechar modal apenas pelo botão "Cancelar" no rodapé
    modal.querySelector('.close-btn').onclick = () => modalBg.remove();

    // Salvar edição
    modal.querySelector('.edit-form').onsubmit = (e) => {
      e.preventDefault();
      const newTitle = modal.querySelector('input[name="title"]').value.trim();
      const newUrl = modal.querySelector('input[name="url"]').value.trim();
      const newKeywords = modal.querySelector('input[name="keywords"]').value.trim().toLowerCase().split(/\s+/);
      // Remove página antiga
      KeywordTrie.removePage(page.url, keywordsPath);
      // Adiciona página editada
      KeywordTrie.insertPage({ title: newTitle, url: newUrl, keywords: newKeywords });
      document.dispatchEvent(new Event('treeUpdated'));
      modalBg.remove();
    };

    modalBg.appendChild(modal);
    document.body.appendChild(modalBg);
  }
      el.appendChild(ul);
    }
    for (const child of Object.values(node.children)) {
      el.appendChild(renderNode(child, path.concat(node.keyword).filter(Boolean)));
    }
    return el;
  }

  document.addEventListener('treeUpdated', renderTree);
  renderTree();

  // Adiciona CSS do modal se não estiver presente
  if (!document.getElementById('modal-css')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './src/styles/modal.css';
    link.id = 'modal-css';
    document.head.appendChild(link);
  }
  return section;
}
