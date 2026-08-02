class ArrowLink extends Component {

  /**
   * @param {Object} props 
   * @param {string} props.href 
   * @param {string} props.text
   * @param {boolean} props.reverse
   */
  constructor(props) {
    super(props, { reverse: false });
    this.id = `arrowlink_${getRandomNumber()}`;
  }

  isExternal() {
    return /^https?:\/\//.test(this.props.href);
  }

  navigateToHref() {
    return navigate(this.props.href);
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    // External links leave the site: let the browser follow the anchor
    // instead of pushing a cross-origin URL into the history.
    const externalAttributes = this.isExternal()
      ? 'target="_blank" rel="noopener noreferrer"'
      : '';

    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <a class="arrow-link-a" href="${this.props.href}" id="${this.id}" ${externalAttributes}>
        ${arrowIcon({ reverse: this.props.reverse, className: 'arrow-link-svg' })}
        <span class="arrow-link-text">${this.props.text}</span>
      </a>
    `);

    if (!this.isExternal()) {
      template.onclick = this.navigateToHref.bind(this);
    }
  }

}
