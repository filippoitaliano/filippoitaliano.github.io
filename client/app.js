window.onload = function() {
  renderLoader()

  // get('http://localhost:8082/articles', (articles) => {
  get('https://filippoitaliano-github-io.onrender.com/articles', (articles) => {
    if (articles) {
      handleBookmarkedPath();

      renderContent(articles);

      // Custom client side rooting event
      window.addEventListener("pathchange", () => renderContent(articles));
      // Browser back and forward handling
      window.addEventListener("popstate", () => renderContent(articles));
    } else {
      renderFallback();
    }
  });
};

// The logo plays its growth once, when the site opens. Every render after that
// is a navigation, and the garden is already where it should be.
let logoHasGrown = false;

const renderContent = (articles) => {
  // Hash used only to support bookmarking, better to reset now
  location.hash = '';

  const root = document.getElementById("app");
  clearNodeContent(root);

  Topbar.appendTo(root, articles, !logoHasGrown);
  logoHasGrown = true;
  ArticlesBar.appendTo(root);

  const layout = root.appendChild(createNode('three-columns-grid-container', 'div'));

  switch(getLocationAreaPath()) {
    case 'articles': {
      const index = new ArticlesIndex({
        articles: articles.filter((a) => a.listed),
      });
      index.appendTo(layout);
      break;
    }
    case 'article': {
      const articleData = articles.find((a) => a.id === getLocationEntityId())
      const article = new Article(articleData)
      article.appendTo(layout);
      break;
    }
    default: {
      articles.forEach((articleData) => {
        if (articleData.listed && articleData.promoted) {
          const article = new ArticlePreview(articleData);
          article.appendTo(layout);
        }
      });
    }
  }

  root.appendChild(createNode('end-page-margin', 'div'));
};

const renderFallback = () => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  const wrapper = createNode('fallback-wrapper');
  root.appendChild(wrapper);

  const title = new Title({ text: 'The server is down for a moment 😿' });
  title.appendTo(wrapper);
};

// Render's free plan can take a while to wake up: the garden grows on a loop
// for as long as the wait lasts.
const renderLoader = () => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  const wrapper = createNode('fallback-wrapper');
  root.appendChild(wrapper);

  appendInnerHtmlTemplate(wrapper, 'loader', `
    <div id="loader" class="loader">
      <img
        class="loader-logo"
        src="${window.location.origin}/client/logo-loading.svg"
        alt="un orto isometrico che cresce, in attesa"
      />
      <p class="loader-text" role="status">
        Caricamento in corso<span class="loader-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
      </p>
    </div>
  `);
}