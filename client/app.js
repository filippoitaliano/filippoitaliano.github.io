window.onload = function() {
  get('http://filippoitaliano.hopto.org/articles', (articles) => {
    if (articles) {
      renderContent(articles);
      // Routing is emulated using location hash, hashchange is the main routing event
      window.addEventListener("hashchange", () => renderContent(articles));
    } else {
      renderFallback();
    }
  });
};

const renderContent = (articles) => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  // TODO: I don't like GridLayout API neither the css implementation
  const gridLayout = new GridLayout();
  gridLayout.appendTo(root);
  const renderedGridLayout = gridLayout.getRenderedChild();

  Topbar.appendTo(renderedGridLayout);

  // This is the router, casing by entity type
  switch(getLocationHashEntityType()) {

    case '#article': {
      const link = new Link('index.html', 'home');
      link.appendTo(renderedGridLayout);
      const articleData = articles.find((a) => a.id === getLocationHashEntityId())
      const article = new Article(articleData, true)
      article.appendTo(renderedGridLayout);
      break;
    }

    default: {
      articles.forEach((articleData) => {
        const article = new Article(articleData);
        article.appendTo(renderedGridLayout);
      });
    }

  }
};

const renderFallback = () => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  const wrapper = createNode('fallback-wrapper');
  root.appendChild(wrapper);

  const title = new Title('The server is down for a moment 😿');
  title.appendTo(wrapper);
};