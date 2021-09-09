class Code extends Component {

  /**
   * @param {Object} props
   * @param {string} props.source
   * @param {string} props.type
   */
  constructor(props) {
    super(props, null, { source: (source) => {
      return source.split('\n');
    } });
    this.id = `code_${getRandomNumber()}`;
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="code-wrapper" id="${this.id}">
        ${this.props.source.map((sourceLine) => (`
          <span class="code-source-line">
            ${sourceLine}
          </span>
        `))}
        <div class="code-type-ribbon">${this.props.type}</div>
      </div>
    `);
  }
  
}
