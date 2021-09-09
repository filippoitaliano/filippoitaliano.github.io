class Title extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   */
  constructor(props) {
    super(props);
    this.id = `title_${getRandomNumber()}`
  }

  appendTo = (parentNode) => {
    super.saveParentNode(parentNode)

    appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="title-wrapper" id="${this.id}">
        <h1 class="title-body-text">
          ${this.props.text}
        </h1>
      </div>
    `);
  }

}
