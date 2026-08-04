class Title extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   * @param {string} [props.date] the day it was planted, `YYYY-MM-DD`
   */
  constructor(props) {
    super(props);
    this.id = `title_${getRandomNumber()}`
  }

  appendTo = (parentNode) => {
    super.saveParentNode(parentNode)

    const date = formatArticleDate(this.props.date);

    appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="title-wrapper" id="${this.id}">
        <h1 class="title-body-text">
          ${this.props.text}
        </h1>
        ${date ? `<time class="title-date" datetime="${this.props.date}">${date}</time>` : ''}
      </div>
    `);
  }

}
