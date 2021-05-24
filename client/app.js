window.onload = function() {
  window.addEventListener("hashchange", renderContent);
  renderContent();
};

const renderContent = () => {
  const root = document.getElementById("app");
  root.innerHTML = null;
  const gridLayout = new GridLayout();
  gridLayout.appendTo(root);
  const renderedGridLayout = gridLayout.getRenderedChild();

  switch(getLocationHashEntityType()) {
    case '#article': {
      const link = new Link('index.html', 'home');
      link.appendTo(renderedGridLayout);
      const articleData = data.articles.find((a) => a.id === getLocationHashEntityId())
      const article = new Article(articleData.id, articleData.title, articleData.relevance, true, articleData.abstract, articleData.previewPicture, articleData.paragraphs)
      article.appendTo(renderedGridLayout);
      break;
    }
    default: {
      data.articles.forEach((articleData) => {
        const article = new Article(articleData.id, articleData.title, articleData.relevance, articleData.promoted, articleData.abstract, articleData.previewPicture, articleData.paragraphs);
        article.appendTo(renderedGridLayout);
      });
    }
  }
}