class Paragraph {
  constructor(text, href) {
    this.href = href;
    this.text = text;
  }

  render(parentNode) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'paragraph-wrapper');

    const text = document.createTextNode(this.text);
    const bodyText = document.createElement('p');

    parentNode.appendChild(wrapper);
    wrapper.appendChild(bodyText);
    bodyText.appendChild(text);
  }
}
