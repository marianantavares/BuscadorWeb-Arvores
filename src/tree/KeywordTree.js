// Implementação de uma Árvore Binária de Busca para indexação de palavras-chave
// Cada nó representa uma palavra-chave e armazena páginas associadas

class KeywordNode {
  constructor(keyword) {
    this.keyword = keyword;
    this.pages = [];
    this.left = null;
    this.right = null;
  }
}

class KeywordTreeClass {
  constructor() {
    this.root = null;
  }

  insertPage(page) {
    for (const keyword of page.keywords) {
      this.root = this._insert(this.root, keyword, page);
    }
  }

  _insert(node, keyword, page) {
    if (!node) {
      const newNode = new KeywordNode(keyword);
      newNode.pages.push(page);
      return newNode;
    }
    if (keyword < node.keyword) {
      node.left = this._insert(node.left, keyword, page);
    } else if (keyword > node.keyword) {
      node.right = this._insert(node.right, keyword, page);
    } else {
      // Palavra já existe, adiciona página se não existir
      if (!node.pages.some(p => p.url === page.url)) {
        node.pages.push(page);
      }
    }
    return node;
  }

  search(keyword) {
    return this._search(this.root, keyword);
  }

  _search(node, keyword) {
    if (!node) return [];
    if (keyword < node.keyword) return this._search(node.left, keyword);
    if (keyword > node.keyword) return this._search(node.right, keyword);
    return node.pages;
  }

  searchMultiple(keywords) {
    const resultSet = new Set();
    for (const kw of keywords) {
      const pages = this.search(kw);
      for (const page of pages) {
        resultSet.add(page);
      }
    }
    return Array.from(resultSet);
  }

  removePage(url, keyword) {
    this.root = this._removePage(this.root, url, keyword);
  }

  _removePage(node, url, keyword) {
    if (!node) return null;
    if (keyword < node.keyword) {
      node.left = this._removePage(node.left, url, keyword);
    } else if (keyword > node.keyword) {
      node.right = this._removePage(node.right, url, keyword);
    } else {
      // Remove página do nó
      node.pages = node.pages.filter(p => p.url !== url);
      // Se não há mais páginas, remove o nó da árvore
      if (node.pages.length === 0) {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        // Nó com dois filhos: substitui pelo menor da subárvore direita
        let minLarger = node.right;
        while (minLarger.left) minLarger = minLarger.left;
        node.keyword = minLarger.keyword;
        node.pages = minLarger.pages;
        node.right = this._removePage(node.right, minLarger.pages[0].url, minLarger.keyword);
      }
    }
    return node;
  }

  getRoot() {
    return this.root;
  }
}

// Singleton para uso global
export const KeywordTree = new KeywordTreeClass();
