class Topbar {

  static backHomeLinkWrapper;

  static appendTo(parentNode) {
    const topbarWrapper = createNode('six-columns-grid-container topbar-wrapper');
    parentNode.appendChild(topbarWrapper);

    const backHomeLinkWrapper = createNode('topbar-back-home-link');
    topbarWrapper.appendChild(backHomeLinkWrapper);
    Topbar.backHomeLinkWrapper = backHomeLinkWrapper;

    const topbarTitle = createNode('topbar-title');
    topbarTitle.appendChild(document.createTextNode('Filippo Italiano'));
    topbarWrapper.appendChild(topbarTitle);

    const firsLink = new DotLink('#article/eb72c5b1-298a-4268-a416-c7a2e82babbe', 'My resume');
    firsLink.appendTo(topbarWrapper);

    const secondLink = new DotLink('https://github.com/filippoitaliano/filippoitaliano.github.io', 'Source code');
    secondLink.appendTo(topbarWrapper);
  }


  static showHomeLink() {
    const link = new ArrowLink('index.html', 'Home', true);
    link.appendTo(Topbar.backHomeLinkWrapper);
  }

}