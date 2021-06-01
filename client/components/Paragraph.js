class Paragraph {
  constructor(text, href) {
    this.href = href;
    this.text = text;
  }

  appendTo(parentNode) {
    const paragraphWrapper = createNode('paragraph-wrapper');
    const bodyText = createNode('paragraph-body-text', 'p');

    parentNode.appendChild(paragraphWrapper);
    paragraphWrapper.appendChild(bodyText);
    bodyText.innerHTML = this.text;
  }
}
