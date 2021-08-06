class Title extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   */
  constructor({ text }) {
    super();
    this._id = `title_${getRandomNumber()}`
    this._props = { text };
  }

  appendTo(parentNode) {
    this._parentNode = parentNode;
    appendInnerHtmlTemplate(this._parentNode, this._id, `
      <div class="title-wrapper" id="${this._id}">
        <h1 class="title-body-text">
          ${this._props.text}
        </h1>
      </div>
    `);
  }

}
