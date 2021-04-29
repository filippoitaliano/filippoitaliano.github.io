class Paragraph {
  constructor(text, href) {
    this.href = href;
    this.text = text;
  }

  appendTo(parentNode) {
    const paragraphWrapper = createNode('paragraph-wrapper');
    const text = document.createTextNode(this.text);
    const bodyText = createNode('paragraph-body-text', 'p');

    parentNode.appendChild(paragraphWrapper);
    paragraphWrapper.appendChild(bodyText);
    bodyText.appendChild(text);
  }
}
