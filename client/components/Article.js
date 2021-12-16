class Article extends Component {

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
    this.id = `article_${props.id}`;
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="two-columns-grid-container article-wrapper" id="${this.id}">
        <div class="title-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const title = new Title({ text: this.props.title });
    title.appendTo(template.querySelector('.title-wrapper'));

    const abstPar = new Paragraph({ text: this.props.abstract });
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    if (this.props.body.length > 0) {
      const bodyWrapper = template.querySelector('.body-wrapper');
      this.props.body.forEach((element) => {
        switch(element.type) {
          case 'code': 
            const c = new Code({
              source: element.content,
              type: element.codeType,
            });
            c.appendTo(bodyWrapper);
            break;
          case 'hr':
            bodyWrapper.appendChild(createNode('','hr'));
            break;
          case 'h3':
            const subtitle = createNode('','h3');
            subtitle.innerHTML = element.content;
            bodyWrapper.appendChild(subtitle);
            break;
          case 'b':
            const boldParagraph = createNode('','b');
            boldParagraph.innerHTML = element.content;
            bodyWrapper.appendChild(boldParagraph);
            break;
          case 'p':
          default:
            const p = new Paragraph({ text: element.content });
            p.appendTo(bodyWrapper);
            break;
        }
      });
    }
  }

}
