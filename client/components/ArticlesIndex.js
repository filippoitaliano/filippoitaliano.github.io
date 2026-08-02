class ArticlesIndex extends Component {

  /**
   * The whole list of what is planted here: the home only shows the promoted
   * article, so without this page the older ones would only be reachable by
   * their own link.
   *
   * @param {Object} props
   * @param {Array} props.articles the listed articles, newest first
   */
  constructor(props) {
    super(props);
    this.id = `articlesindex_${getRandomNumber()}`;
  }

  static _renderEntry(article, id) {
    return `
      <li class="articles-index-item">
        <a class="articles-index-link" id="${id}" href="/article/${article.id}">
          ${article.title}
        </a>
        <p class="articles-index-abstract">${article.abstract}</p>
      </li>
    `;
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    const entries = this.props.articles.map((article) => ({
      article,
      linkId: `articlesindexlink_${getRandomNumber()}`,
    }));

    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="two-columns-grid-container article-wrapper" id="${this.id}">
        <div class="title-wrapper"></div>
        <div class="abstract-wrapper">
          <ul class="articles-index-list">
            ${entries.map(({ article, linkId }) => ArticlesIndex._renderEntry(article, linkId)).join('')}
          </ul>
        </div>
      </div>
    `);

    const title = new Title({ text: 'Tutti gli articoli' });
    title.appendTo(template.querySelector('.title-wrapper'));

    if (entries.length === 0) {
      const empty = new Paragraph({ text: 'Qui non è ancora spuntato niente.' });
      empty.appendTo(template.querySelector('.abstract-wrapper'));
      return;
    }

    entries.forEach(({ article, linkId }) => {
      const link = template.querySelector(`#${linkId}`);
      link.onclick = () => navigate(`/article/${article.id}`);
    });
  }

}
