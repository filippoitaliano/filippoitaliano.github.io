class Topbar {

  static appendTo(parentNode) {
    const topbarWrapper = createNode('six-columns-grid-container topbar-wrapper');
    parentNode.appendChild(topbarWrapper);

    const topbarTitle = createNode('topbar-title', 'a');
    topbarTitle.innerText = 'Filippo Italiano';
    topbarTitle.href = "index.html";
    topbarWrapper.appendChild(topbarTitle);

    const firsLink = new DotLink({
      href: '#article/eb72c5b1-298a-4268-a416-c7a2e82babbe', 
      text: 'My resume'
    });
    firsLink.appendTo(topbarWrapper);

    const secondLink = new DotLink({
      href: 'https://github.com/filippoitaliano/filippoitaliano.github.io', 
      text: 'Source code'
    });
    secondLink.appendTo(topbarWrapper);
  }

}