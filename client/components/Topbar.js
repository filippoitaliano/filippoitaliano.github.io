class Topbar {

  static navigateHome() {
    return navigate('/');
  }

  static appendTo(parentNode) {
    const id = `topbar_${getRandomNumber()}`;

    const template = appendInnerHtmlTemplate(parentNode, id, `
      <div class="six-columns-grid-container topbar-wrapper" id="${id}">
        <a class="topbar-title" href="/">
          Filippo Italiano
        </a>
        <div id="topbar-link-1"></div>
        <div id="topbar-link-2"></div>
      </div>
    `);

    template.onclick = Topbar.navigateHome;

    const firstLink = new DotLink({
      href: '#article/eb72c5b1-298a-4268-a416-c7a2e82babbe', 
      text: 'My resume'
    });
    firstLink.appendTo(template.querySelector('#topbar-link-1'));

    const secondLink = new DotLink({
      href: 'https://github.com/filippoitaliano/filippoitaliano.github.io', 
      text: 'Source code'
    });
    secondLink.appendTo(template.querySelector('#topbar-link-2'));
  }

}