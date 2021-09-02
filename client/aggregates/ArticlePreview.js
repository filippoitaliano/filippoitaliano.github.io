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
  constructor(props) {
    super(props);
    this._id = `article_preview_${props.id}`;
  }

  _previewImageType() {
    if (this._props.promoted) return PreviewImage.TYPE.normal;
    return PreviewImage.TYPE.small;
  }

  _articleClassName() {
    if (this._props.promoted) return 'six-columns-grid-container article-wrapper';
    return 'six-columns-grid-container article-preview-wrapper';
  }

  appendTo(parentNode) {
    super.appendTo(parentNode);
    
    console.log(this._props);

    const template = appendInnerHtmlTemplate(parentNode, this._id, `
      <div class="${this._articleClassName()} grid-layout-wrapper" id="${this._id}">
        <div class="title-wrapper"></div>
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const prevPic = new PreviewImage(this._props.previewPicture, this._previewImageType());
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph(this._props.abstract);
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    const link = new ArrowLink({
      href: `#article/${this._props.id}`,
      text: 'leggi tutto'
    });

    if (this._props.promoted) {
      const title = new Title({ text: this._props.title });
      title.appendTo(template.querySelector('.title-wrapper'));

      if (this._props.body.length > 0) {
        const bodyWrapper = template.querySelector('.body-wrapper')
        const firstParagrah = this._props.body.find((element) => element.type === 'p');
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
