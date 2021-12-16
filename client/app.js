window.onload = function() {
  renderLoader()

  // get('http://localhost:8082/articles', (articles) => {
  get('https://www.wholejs.com/articles', (articles) => {
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

const renderContent = (articles) => {
  // Hash used only to support bookmarking, better to reset now
  location.hash = '';

  const root = document.getElementById("app");
  clearNodeContent(root);

  Topbar.appendTo(root);
  ArticlesBar.appendTo(root);

  const layout = root.appendChild(createNode('three-columns-grid-container', 'div'));

  switch(getLocationAreaPath()) {
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

const renderLoader = () => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  const wrapper = createNode('fallback-wrapper');
  root.appendChild(wrapper);

  const title = new Title({ text: '⏳' });
  title.appendTo(wrapper);
}