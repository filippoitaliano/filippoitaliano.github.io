class Title {
  constructor(text) {
    this.text = text;
  }

  appendTo(parentNode) {
    const titleWrapper = createNode('title-wrapper');
    const titleBodyText = createNode('title-body-text', 'h1');
    titleBodyText.appendChild(document.createTextNode(this.text));

    parentNode.appendChild(titleWrapper);
    titleWrapper.appendChild(titleBodyText);
  }
}
