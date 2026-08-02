// The bed in the logo never grows past a 3x3 of tiles: this mirrors GRID_MAX
// in tools/generate-artifacts.py, which is what actually draws the thing.
const GARDEN_GRID_MAX = 3;
// How long a touch has to stay down before it counts as "hold to read", instead
// of a tap that goes home.
const GARDEN_HOLD_MS = 350;
const GARDEN_HOLD_TIMEOUT_MS = 5000;

class Topbar {

  static navigateHome() {
    return navigate('/');
  }

  /**
   * What the logo is showing right now. Same rule as `garden_growth` in
   * tools/generate-artifacts.py: the bed is the smallest square grid that
   * holds every project, and every published article plants one plant in it.
   * @param {Array} articles
   */
  static gardenState(articles) {
    const projects = ARTICLES_BAR_ARTIFACTS.length;
    const published = (articles || []).filter((a) => a.listed).length;
    const side = Math.min(
      GARDEN_GRID_MAX,
      Math.max(1, Math.ceil(Math.sqrt(Math.max(1, projects))))
    );
    const tiles = side * side;
    return { tiles, plants: Math.max(1, Math.min(tiles, published)) };
  }

  static _count(value, singular, plural) {
    return `<b class="topbar-logo-tooltip-count">${value} ${value === 1 ? singular : plural}</b>`;
  }

  static _tooltipText(articles) {
    const { tiles, plants } = Topbar.gardenState(articles);
    return `
      Questo logo è il mio orto: adesso ha
      ${Topbar._count(tiles, 'mattonella', 'mattonelle')} e
      ${Topbar._count(plants, 'pianta', 'piante')}, una per ogni articolo.
      Cresce ogni volta che pianto qualcosa di nuovo.
    `;
  }

  /**
   * Hover on a pointer, press and hold on a touch screen. The hold has to stop
   * the tap from navigating home, otherwise reading the tooltip would leave
   * the page you were on — and it has to stop the browser from treating the
   * hold as "you want to save this image", which is what a long press on an
   * <img> means by default.
   */
  static _bindHold(wrapper, link) {
    let timer = null;
    let hideTimer = null;
    let held = false;

    const hide = () => {
      clearTimeout(hideTimer);
      wrapper.classList.remove('is-held');
    };

    const show = () => {
      held = true;
      wrapper.classList.add('is-held');
      hideTimer = setTimeout(hide, GARDEN_HOLD_TIMEOUT_MS);
      // The next touch anywhere puts it away again. `once` keeps the listener
      // from piling up every time the topbar is re-rendered.
      document.addEventListener('touchstart', hide, { once: true });
    };

    link.addEventListener('touchstart', () => {
      held = false;
      timer = setTimeout(show, GARDEN_HOLD_MS);
    }, { passive: true });

    ['touchend', 'touchcancel', 'touchmove'].forEach((event) => {
      link.addEventListener(event, () => clearTimeout(timer), { passive: true });
    });

    // Android fires this at the end of a long press, and it is what opens the
    // "save image" sheet over the tooltip.
    link.addEventListener('contextmenu', (event) => event.preventDefault());

    link.onclick = (event) => {
      event.preventDefault();
      if (held) {
        // This click is the tail of a hold: the tooltip stays, the page does not
        // change.
        held = false;
        return false;
      }
      hide();
      return Topbar.navigateHome();
    };
  }

  /**
   * @param {Node} parentNode
   * @param {Array} articles the published articles, used to tell how far along
   *   the garden in the logo is
   * @param {boolean} animate run the growth once, from the barest plot to a
   *   full bed and back down to where the garden actually is. Only on the
   *   first render: replaying it at every navigation would be a tic.
   */
  static appendTo(parentNode, articles, animate = false) {
    const id = `topbar_${getRandomNumber()}`;
    const tooltipId = `${id}_tooltip`;
    const logo = animate && !prefersReducedMotion() ? 'logo-growing.svg' : 'logo.svg';

    const template = appendInnerHtmlTemplate(parentNode, id, `
      <div class="six-columns-grid-container topbar-wrapper" id="${id}">
        <div class="topbar-logo-wrapper">
          <a
            id="home-link"
            class="topbar-logo-link"
            href="/"
            aria-describedby="${tooltipId}"
          >
            <img
              class="topbar-logo"
              src="${window.location.origin}/client/${logo}"
              alt="an isometric garden plot with a flower aka the logo"
              draggable="false"
            />
          </a>
          <span class="topbar-logo-tooltip" id="${tooltipId}" role="tooltip">
            ${Topbar._tooltipText(articles)}
          </span>
        </div>
        <div class="topbar-links" id="topbar-links"></div>
      </div>
    `);

    Topbar._bindHold(
      template.querySelector('.topbar-logo-wrapper'),
      template.querySelector('#home-link')
    );

    const links = template.querySelector('#topbar-links');

    // The logo already goes home, but only if you guess that it does: the first
    // link says it out loud.
    const homeLink = new ArrowLink({
      href: '/',
      text: 'Home'
    });
    homeLink.appendTo(links);

    const indexLink = new ArrowLink({
      href: '/articles',
      text: 'Tutti gli articoli'
    });
    indexLink.appendTo(links);

    const resumeLink = new ArrowLink({
      href: 'https://www.linkedin.com/in/filippoitaliano/',
      text: 'My resume'
    });
    resumeLink.appendTo(links);
  }

}
