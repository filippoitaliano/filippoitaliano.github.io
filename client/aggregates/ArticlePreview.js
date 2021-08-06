class ArticlePreview extends Component {

  /**
   * @param {Object} props 
   * @param {String} props.id
   * @param {String} props.title
   * @param {String} props.relevance
   * @param {String} props.promoted
   * @param {String} props.abstract
   * @param {String} props.previewPicture
   * @param {String} props.body
   */
  constructor({ id, title, relevance, promoted, abstract, previewPicture, body }) {
    super();
    this.id = `article_preview_${id}`;
    this.props = {
      id: id,
      title: title,
      relevance: relevance,
      promoted: promoted,
      abstract: abstract,
      previewPicture: previewPicture,
      body: body,
    };
  }

  _previewImageType() {
    if (this.props.promoted) return PreviewImage.TYPE.normal;
    return PreviewImage.TYPE.small;
  }

  _articleClassName() {
    if (this.props.promoted) return 'six-columns-grid-container article-wrapper';
    return 'six-columns-grid-container article-preview-wrapper';
  }

  appendTo(parentNode) {
    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="${this._articleClassName()} grid-layout-wrapper" id="${this.id}">
        <div class="title-wrapper"></div>
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const prevPic = new PreviewImage(this.props.previewPicture, this._previewImageType());
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph(this.props.abstract);
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    const link = new ArrowLink(`#article/${this.props.id}`, 'leggi tutto');

    if (this.props.promoted) {
      const title = new Title({ text: this.props.title });
      title.appendTo(template.querySelector('.title-wrapper'));

      if (this.props.body.length > 0) {
        const bodyWrapper = template.querySelector('.body-wrapper')
        const firstParagrah = this.props.body.find((element) => element.type === 'p');
        if (firstParagrah) {
          const p = new Paragraph(firstParagrah.content);
          p.appendTo(bodyWrapper);  
          link.appendTo(template.querySelector('.body-wrapper'));
        }
        const separator = createNode('article-promoted-separator');
        bodyWrapper.appendChild(separator);
      }
    } else {
      link.appendTo(template.querySelector('.abstract-wrapper'));
    }
  }

}