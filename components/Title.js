class Title {
  constructor(text) {
    this.text = text;
  }

  appendTo(parentNode) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'title-wrapper');

    const text = document.createTextNode(this.text);
    const bodyText = document.createElement('h1');

    parentNode.appendChild(wrapper);
    wrapper.appendChild(bodyText);
    bodyText.appendChild(text);
  }
}
