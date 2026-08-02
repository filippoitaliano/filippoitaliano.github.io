const ARTICLES_BAR_ARTIFACTS = [
  {
    name: 'blindtales-app',
    src: '/client/artifacts/blindtales-app.svg',
    href: 'https://blindtales.app/',
    alt: 'an isometric book telling its tale as sound waves',
  },
  {
    name: 'gpio-pin-select',
    src: '/client/raspberry.png',
    href: 'https://github.com/filippoitaliano/gpio-pin-select',
    alt: 'an isometric raspberry pi board',
  },
  {
    name: 'filippoitaliano.github.io',
    src: '/client/artifacts/garden.svg',
    href: 'https://github.com/filippoitaliano/filippoitaliano.github.io',
    alt: 'an isometric garden plot with a sprout',
  },
  {
    name: 'tomato-timer',
    src: '/client/artifacts/tomato-timer.svg',
    href: 'https://github.com/filippoitaliano/tomato-timer',
    alt: 'an isometric tomato with a clock dial',
  },
  {
    name: 'react-webpack-seed',
    src: '/client/artifacts/react-webpack-seed.svg',
    href: 'https://github.com/filippoitaliano/react-webpack-seed',
    alt: 'an isometric crate of bundled modules under a react atom',
  },
  {
    name: 'event-driven-booking-app',
    src: '/client/artifacts/event-driven-booking-app.svg',
    href: 'https://github.com/filippoitaliano/event-driven-booking-app',
    alt: 'an isometric booking slot emitting events to a phone',
  },
];

class ArticlesBar {

  static _renderArtifact({ name, src, href, alt }) {
    return `
      <a class="repo-artifact" href="${href}" target="_blank" rel="noopener noreferrer">
        <img
          class="repo-artifact-img"
          src="${window.location.origin}${src}"
          alt="${alt}"
        />
        <span class="repo-artifact-name">${name}</span>
      </a>
    `;
  }

  static appendTo(parentNode) {
    const id = `articlesbar_${getRandomNumber()}`;

    appendInnerHtmlTemplate(parentNode, id, `
      <hr />
      <div class="articles-bar" id="${id}">
        ${ARTICLES_BAR_ARTIFACTS.map(ArticlesBar._renderArtifact).join('')}
      </div>
      <hr />
    `);
  }

}
