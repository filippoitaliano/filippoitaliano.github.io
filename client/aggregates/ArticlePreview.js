class ArticlePreview extends Component {

  /**
   * @param {Object} props 
   * @param {String} props.id
   * @param {String} props.title
   * @param {String} props.relevance
   * @param {String} props.promoted
   * @param {String} props.listed
   * @param {String} props.abstract
   * @param {String} props.previewPicture
   * @param {String} props.body
   */
  constructor(props) {
    super(props);
    this.id = `articlepreview_${props.id}`;
  }

  _previewImageType() {
    if (this.props.promoted) return PREVIEW_IMAGE_TYPE.normal;
    return PREVIEW_IMAGE_TYPE.small;
  }

  _articleClassName() {
    if (this.props.promoted) return 'six-columns-grid-container article-wrapper';
    return 'six-columns-grid-container article-preview-wrapper';
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="${this._articleClassName()} grid-layout-wrapper" id="${this.id}">
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="title-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const prevPic = new PreviewImage({
      src: this.props.previewPicture,
      type: this._previewImageType(),
    });
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph({ text: this.props.abstract });
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    const link = new ArrowLink({
      href: `#article/${this.props.id}`,
      text: 'leggi tutto'
    });

    if (this.props.promoted) {
      const title = new Title({ text: this.props.title });
      title.appendTo(template.querySelector('.title-wrapper'));

      if (this.props.body.length > 0) {
        const bodyWrapper = template.querySelector('.body-wrapper')
        const firstParagrah = this.props.body.find((element) => element.type === 'p');
        if (firstParagrah) {
          const p = new Paragraph({ text: firstParagrah.content });
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
