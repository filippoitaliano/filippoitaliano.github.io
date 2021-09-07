class Topbar {

  static backHomeLinkWrapper;

  static appendTo(parentNode) {
    const topbarWrapper = createNode('six-columns-grid-container topbar-wrapper');
    parentNode.appendChild(topbarWrapper);

    const topbarTitle = createNode('topbar-title', 'a');
    topbarTitle.innerText = 'Filippo Italiano';
    topbarTitle.href = "index.html";
    topbarWrapper.appendChild(topbarTitle);

    const firsLink = new DotLink('#article/eb72c5b1-298a-4268-a416-c7a2e82babbe', 'My resume');
    firsLink.appendTo(topbarWrapper);

    const secondLink = new DotLink('https://github.com/filippoitaliano/filippoitaliano.github.io', 'Source code');
    secondLink.appendTo(topbarWrapper);
  }

}