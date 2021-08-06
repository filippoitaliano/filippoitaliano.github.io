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
   */
  constructor({ id, title, relevance, promoted, abstract, previewPicture, body }) {
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
    };
  }

  appendTo(parentNode) {
    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="six-columns-grid-container article-wrapper" id="${this.id}">
        <div class="title-wrapper"></div>
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const title = new Title({ text: this.props.title });
    title.appendTo(template.querySelector('.title-wrapper'));

    const prevPic = new PreviewImage(this.props.previewPicture, PreviewImage.TYPE.normal);
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph(this.props.abstract);
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    if (this.props.body.length > 0) {
      const bodyWrapper = template.querySelector('.body-wrapper');
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
    }
  }

}
