class Paragraph extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   */
  constructor(props) {
    super(props);
    this.id = `paragraph_${getRandomNumber()}`;
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="paragraph-wrapper" id="${this.id}">
        <p class="paragraph-body-text">
          ${this.props.text}
        </p>
      </div>
    `);
  }

}
