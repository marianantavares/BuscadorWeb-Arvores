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
        li.innerHTML = `<strong>${page.title}</strong> <a href="${page.url}" target="_blank">${page.url}</a> <button data-url="${page.url}">Remover</button>`;
        li.querySelector('button').onclick = () => {
          KeywordTrie.removePage(page.url, path.concat(node.keyword).filter(Boolean));
          document.dispatchEvent(new Event('treeUpdated'));
        };
        ul.appendChild(li);
      });
      el.appendChild(ul);
    }
    for (const child of Object.values(node.children)) {
      el.appendChild(renderNode(child, path.concat(node.keyword).filter(Boolean)));
    }
    return el;
  }

  document.addEventListener('treeUpdated', renderTree);
  renderTree();

  return section;
}
