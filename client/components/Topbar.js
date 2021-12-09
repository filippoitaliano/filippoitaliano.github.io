class Topbar {

  static navigateHome() {
    return navigate('/');
  }

  static appendTo(parentNode) {
    const id = `topbar_${getRandomNumber()}`;

    // <a id="home-link" className="topbar-title" href="/">
    //   Filippo Italiano
    // </a>

    console.log(JSON.stringify(window.location));

    const template = appendInnerHtmlTemplate(parentNode, id, `
      <div class="six-columns-grid-container topbar-wrapper" id="${id}">
        <div class="topbar-logo-wrapper">
          <img 
            id="home-link" 
            class="topbar-logo" 
            src="${window.location.origin}/client/logo.png"
            alt="four colorfull 45 degrees lines aka the logo" 
          />
        </div>
        <div class="topbar-link" id="topbar-link-1"></div>
        <div class="topbar-link" id="topbar-link-2"></div>
      </div>
    `);

    const homeLink = document.getElementById('home-link');
    homeLink.onclick = Topbar.navigateHome;

    const firstLink = new DotLink({
      href: '/article/eb72c5b1-298a-4268-a416-c7a2e82babbe', 
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