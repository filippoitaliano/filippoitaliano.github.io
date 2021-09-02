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
  constructor(props) {
    super(props);
    this._id = `article_${props.id}`;
  }

  appendTo(parentNode) {
    super.appendTo(parentNode);

    const template = appendInnerHtmlTemplate(parentNode, this._id, `
      <div class="six-columns-grid-container article-wrapper" id="${this._id}">
        <div class="title-wrapper"></div>
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const title = new Title({ text: this._props.title });
    title.appendTo(template.querySelector('.title-wrapper'));

    const prevPic = new PreviewImage(this._props.previewPicture, PreviewImage.TYPE.normal);
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph(this._props.abstract);
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    if (this._props.body.length > 0) {
      const bodyWrapper = template.querySelector('.body-wrapper');
      this._props.body.forEach((element) => {
        switch(element.type) {
          case 'p':
            const p = new Paragraph(element.content);
            p.appendTo(bodyWrapper);
            break;
          case 'code': 
            const c = new Code({
              source: element.content,
              type: element.codeType,
            });
            c.appendTo(bodyWrapper);
        }
      });
    }
  }

}
