window.onload = function() {
  get('http://filippoitaliano.hopto.org/articles', (data) => {
    if (data) {
      renderContent(data);
      // Routing is emulated using location hash, hashchange is the main routing event
      window.addEventListener("hashchange", () => renderContent(data));
    }
  });
};

const renderContent = (data) => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  // TODO: I don't like GridLayout API
  const gridLayout = new GridLayout();
  gridLayout.appendTo(root);
  const renderedGridLayout = gridLayout.getRenderedChild();

  Topbar.appendTo(renderedGridLayout);

  // This is the router, casing by entity type
  switch(getLocationHashEntityType()) {

    case '#article': {
      const link = new Link('index.html', 'home');
      link.appendTo(renderedGridLayout);
      const articleData = data.articles.find((a) => a.id === getLocationHashEntityId())
      const article = new Article(articleData, true)
      article.appendTo(renderedGridLayout);
      break;
    }

    default: {
      data.articles.forEach((articleData) => {
        const article = new Article(articleData);
        article.appendTo(renderedGridLayout);
      });
    }

  }
}