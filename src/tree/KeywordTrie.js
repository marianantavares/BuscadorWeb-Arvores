// Implementação de Trie para indexação hierárquica de palavras-chave
class TrieNode {
  constructor(keyword = '') {
    this.keyword = keyword;
    this.children = {};
    this.pages = [];
  }
}

class KeywordTrieClass {
  constructor() {
    this.root = new TrieNode();
    this.loadFromStorage();
  }

  // Função para normalizar palavras-chave
  _normalize(str) {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
  }

  insertPage(page) {
    // Normaliza todas as palavras-chave
    page.keywords = page.keywords.map(kw => this._normalize(kw));
    let node = this.root;
    for (const keyword of page.keywords) {
      if (!node.children[keyword]) {
        node.children[keyword] = new TrieNode(keyword);
      }
      node = node.children[keyword];
    }
    if (!node.pages.some(p => p.url === page.url)) {
      node.pages.push(page);
      this.saveToStorage();
    }
  }

  searchPath(keywords) {
    let node = this.root;
    for (const keyword of keywords) {
      if (!node.children[keyword]) return [];
      node = node.children[keyword];
    }
    return node.pages;
  }

  searchMultiple(keywords) {
    if (!keywords.length) return [];
    const normKeywords = keywords.map(kw => this._normalize(kw));
    const allPages = this._collectPages(this.root, []);
    return allPages.filter(page => {
      // Normaliza o título para busca
      const titleWords = page.title
        ? page.title.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().split(/\s+/)
        : [];
      return normKeywords.every(kw =>
        page.keywords.includes(kw) || titleWords.includes(kw)
      );
    });
  }

  removePage(url, keywords) {
    this._removePage(this.root, url, keywords, 0);
    this.saveToStorage();
  }

  _removePage(node, url, keywords, idx) {
    if (idx === keywords.length) {
      node.pages = node.pages.filter(p => p.url !== url);
      return;
    }
    const kw = keywords[idx];
    if (node.children[kw]) {
      this._removePage(node.children[kw], url, keywords, idx + 1);
      // Remove nó vazio
      if (Object.keys(node.children[kw].children).length === 0 && node.children[kw].pages.length === 0) {
        delete node.children[kw];
      }
    }
  }

  getRoot() {
    return this.root;
  }

  // Persistência
  saveToStorage() {
    const pages = this._collectPages(this.root, []);
    try {
      localStorage.setItem('buscadorweb_pages', JSON.stringify(pages));
    } catch (e) {}
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('buscadorweb_pages');
      if (data) {
        const pages = JSON.parse(data);
        for (const page of pages) {
          this.insertPage(page);
        }
      }
    } catch (e) {}
  }

  _collectPages(node, acc) {
    for (const page of node.pages) acc.push(page);
    for (const child of Object.values(node.children)) {
      this._collectPages(child, acc);
    }
    return acc;
  }
}

export const KeywordTrie = new KeywordTrieClass();
