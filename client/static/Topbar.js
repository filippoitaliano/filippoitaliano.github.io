class Topbar {

  static appendTo(parentNode) {
    const topbarWrapper = createNode('six-columns-grid-container topbar-wrapper');
    parentNode.appendChild(topbarWrapper);

    const backHomeLinkWrapper = createNode('topbar-back-home-link');
    const link = new ArrowLink('index.html', 'Home', true);
    link.appendTo(backHomeLinkWrapper);
    topbarWrapper.appendChild(backHomeLinkWrapper);

    const topbarTitle = createNode('topbar-title');
    topbarTitle.appendChild(document.createTextNode('Filippo Italiano'));
    topbarWrapper.appendChild(topbarTitle);

    const firsLink = new DotLink('#article/d4823511-b688-4972-9956-25c0e3ef7130', 'Curated list');
    firsLink.appendTo(topbarWrapper);

    const secondLink = new DotLink('https://github.com/filippoitaliano/filippoitaliano.github.io', 'Source code');
    secondLink.appendTo(topbarWrapper);
  }

  static showHomeLink() {}

}