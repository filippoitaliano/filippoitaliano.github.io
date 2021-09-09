class Title extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   */
  constructor(props) {
    super(props);
    this._id = `title_${getRandomNumber()}`
  }

  appendTo = (parentNode) => {
    super.saveParentNode(parentNode)

    appendInnerHtmlTemplate(parentNode, this._id, `
      <div class="title-wrapper" id="${this._id}">
        <h1 class="title-body-text">
          ${this._props.text}
        </h1>
      </div>
    `);
  }

}
