class GridLayout {
  renderedChild = null;

  appendTo(parentNode) {
    const gridLayoutWrapper = createNode('grid-layout-wrapper');
    this.renderedChild = parentNode.appendChild(gridLayoutWrapper);
  }

  getRenderedChild() {
    return this.renderedChild;
  }
}