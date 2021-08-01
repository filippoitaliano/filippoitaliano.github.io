class Title extends Component {

  constructor(props) {
    super();
    this.id = `title_${getRandomNumber()}`
    this.props = props;
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
