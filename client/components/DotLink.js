class DotLink extends Component {

  /**
   * @param {Object} props
   * @param {string} props.href
   * @param {string} props.text
   */
  constructor(props) {
    super(props);
    this.id = `dotlink_${getRandomNumber()}`;
  }

  navigateToHref() {
    return navigate(this.props.href);
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <a class="dot-link-a" href="${this.props.href}" id="${this.id}">
        <span class="dot-link-svg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 11 11"><g id="Group_5" data-name="Group 5" transform="translate(-846 -59)"><g id="Ellipse_2" data-name="Ellipse 2" transform="translate(846 59)" fill="#fff" stroke="#707070" stroke-width="2"><circle cx="5.5" cy="5.5" r="5.5" stroke="none"/><circle cx="5.5" cy="5.5" r="4.5" fill="none"/></g><circle id="Ellipse_4" data-name="Ellipse 4" cx="1.5" cy="1.5" r="1.5" transform="translate(850 63)" fill="red"/></g></svg>
        </span>
        <span class="dot-link-text">
          ${this.props.text}
        </span>
    `);

    template.onclick = this.navigateToHref.bind(this);
  }

}
