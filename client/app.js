window.onload = function() {
  renderLoader()
  // get('http://localhost:8082/articles', (articles) => {
  get('https://www.wholejs.com/articles', (articles) => {
    if (articles) {
      setTimeout(() => renderContent(articles), 500);
      window.addEventListener("pathchange", () => renderContent(articles));
    } else {
      setTimeout(renderFallback, 500);
    }
  });
};

const renderContent = (articles) => {
  const root = document.getElementById("app");
  clearNodeContent(root);

  Topbar.appendTo(root);

  switch(getLocationAreaPath()) {
    case 'article': {
      const articleData = articles.find((a) => a.id === getLocationEntityId())
      const article = new Article(articleData)
      article.appendTo(root);
      break;
    }
    default: {
      articles.forEach((articleData) => {
        if (articleData.listed) {
          const article = new ArticlePreview(articleData);
          article.appendTo(root);
        }
      });
    }
  }

  root.appendChild(createNode('end-page-margin', 'hr'))
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