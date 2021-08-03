class Article extends Component {

  /**
   * @param {Object} props 
   * @param {String} props.id
   * @param {String} props.title
   * @param {String} props.relevance
   * @param {String} props.promoted
   * @param {String} props.abstract
   * @param {String} props.previewPicture
   * @param {String} props.body
   * @param {String} props.fullContent
   */
  constructor({ id, title, relevance, promoted, abstract, previewPicture, body, fullContent = false }) {
    super();
    this.id = `article_${id}`;
    this.props = {
      id: id,
      title: title,
      relevance: relevance,
      promoted: promoted,
      abstract: abstract,
      previewPicture: previewPicture,
      body: body,
      fullContent: fullContent,
    };
  }

  previewImageType() {
    if (this.props.fullContent || this.props.promoted) return PreviewImage.TYPE.normal;
    return PreviewImage.TYPE.small;
  }

  articleClassName() {
    if (this.props.fullContent || this.props.promoted) return 'six-columns-grid-container article-wrapper';
    return 'six-columns-grid-container article-preview-wrapper';
  }

  appendTo(parentNode) {
    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="${this.articleClassName()} grid-layout-wrapper" id="${this.id}">
        <div class="title-wrapper"></div>
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const prevPic = new PreviewImage(this.props.previewPicture, this.previewImageType());
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph(this.props.abstract);
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    // TODO: link at the end of the first paragraph if promoted
    const link = new ArrowLink(`#article/${this.props.id}`, 'leggi tutto');
    link.appendTo(template.querySelector('.abstract-wrapper'));

    if (this.props.fullContent || this.props.promoted) {
      const title = new Title({ text: this.props.title });
      title.appendTo(template.querySelector('.title-wrapper'));

      if (this.props.body.length > 0) {
        const bodyWrapper = template.querySelector('.body-wrapper')
        if (this.props.fullContent) {
          this.props.body.forEach((element) => {
            switch(element.type) {
              case 'p':
                const p = new Paragraph(element.content);
                p.appendTo(bodyWrapper);
                break;
              case 'code': 
                const c = new Code(element.content, element.codeType);
                c.appendTo(bodyWrapper);
            }
          });
        } else {
          const firstParagrah = this.props.body.find((element) => element.type === 'p');
          if (firstParagrah) {
            const p = new Paragraph(firstParagrah.content);
            p.appendTo(bodyWrapper);  
          }
          const separator = createNode('article-promoted-separator');
          bodyWrapper.appendChild(separator);
        }
      }
    }
  }

}
