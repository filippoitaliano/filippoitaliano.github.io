class Topbar {

  static appendTo(parentNode) {
    const topbarWrapper = createNode('topbar-wrapper');
    parentNode.appendChild(topbarWrapper);

    const topbarTitle = createNode('topbar-title');
    topbarTitle.appendChild(document.createTextNode('Filippo Italiano'));
    topbarWrapper.appendChild(topbarTitle);
  }

}