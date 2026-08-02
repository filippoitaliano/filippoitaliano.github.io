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

    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="code-block" id="${this.id}">
        <div class="code-wrapper">
          ${this.props.source.map((sourceLine) => (`
            <div class="code-source-line">
              ${sourceLine}
            </div>
          `))}
          <div class="code-type-ribbon">${this.props.type}</div>
        </div>
      </div>
    `);

    ScrollHint.appendTo(template, template.querySelector('.code-wrapper'));
  }
  
}
