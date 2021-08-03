class Title extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   */
  constructor({ text }) {
    super();
    this.id = `title_${getRandomNumber()}`
    this.props = { text };
  }

  appendTo(parentNode) {
    this.parentNode = parentNode;
    const template = `
      <div class="title-wrapper" id="${this.id}">
        <h1 class="title-body-text">
          ${this.props.text}
        </h1>
      </div>
    `;
    appendInnerHtmlTemplate(parentNode, this.id, template);
  }

}
