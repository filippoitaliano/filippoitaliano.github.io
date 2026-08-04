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
          ${this.props.source.map((sourceLine) => (
            // Joined by hand, and with nothing around the line but its own tags:
            // an array dropped into a template literal is joined with commas,
            // which would land between one line and the next, and the line is
            // set `pre`, so any indentation of the markup would be read as
            // indentation of the code.
            `<div class="code-source-line">${sourceLine}</div>`
          )).join('')}
          <div class="code-type-ribbon">${this.props.type}</div>
        </div>
      </div>
    `);

    ScrollHint.appendTo(template, template.querySelector('.code-wrapper'));
  }
  
}
