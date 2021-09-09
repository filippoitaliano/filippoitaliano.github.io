class Paragraph extends Component {

  /**
   * @param {Object} props
   * @param {string} props.text
   */
  constructor(props) {
    super(props);
    this._id = `paragraph_${getRandomNumber()}`;
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    const paragraphWrapper = createNode('paragraph-wrapper');
    const bodyText = createNode('paragraph-body-text', 'p');

    parentNode.appendChild(paragraphWrapper);
    paragraphWrapper.appendChild(bodyText);
    bodyText.innerHTML = this._props.text;
  }

}
