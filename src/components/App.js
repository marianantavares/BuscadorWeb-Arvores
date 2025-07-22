import { SearchPanel } from './SearchPanel.js';
import { PageForm } from './PageForm.js';
import { TreeView } from './TreeView.js';

export function App() {
  const container = document.createElement('div');
  container.appendChild(SearchPanel());
  container.appendChild(PageForm());
  container.appendChild(TreeView());
  return container;
}
