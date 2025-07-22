import { KeywordTree } from '../tree/KeywordTree.js';

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
    const root = KeywordTree.getRoot();
    if (!root) {
      treeDiv.textContent = 'Árvore vazia.';
      return;
    }
    treeDiv.appendChild(renderNode(root));
  }

  function renderNode(node) {
    const el = document.createElement('div');
    el.className = 'tree-node';
    el.innerHTML = `<span class="keyword">${node.keyword}</span>`;
    if (node.pages.length > 0) {
      const ul = document.createElement('ul');
      node.pages.forEach(page => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${page.title}</strong> <a href="${page.url}" target="_blank">${page.url}</a> <button data-url="${page.url}">Remover</button>`;
        li.querySelector('button').onclick = () => {
          KeywordTree.removePage(page.url, node.keyword);
          document.dispatchEvent(new Event('treeUpdated'));
        };
        ul.appendChild(li);
      });
      el.appendChild(ul);
    }
    if (node.left) el.appendChild(renderNode(node.left));
    if (node.right) el.appendChild(renderNode(node.right));
    return el;
  }

  document.addEventListener('treeUpdated', renderTree);
  renderTree();

  return section;
}
