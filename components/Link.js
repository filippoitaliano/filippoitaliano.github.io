class Link {
  constructor(href, text) {
    this.href = href;
    this.text = text;
  }

  render(parentNode) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute('class', 'link-wrapper');

    const a = document.createElement("a");
    a.href = this.href;

    const arrow = document.createTextNode('0xE2 0x9F 0xB6');
    const arrowStyled = document.createElement('span');
    arrowStyled.setAttribute('class', 'link-arrow-span');
    arrowStyled.appendChild(arrow);

    const text = document.createTextNode(this.text);
    const textSpan = document.createElement('span');
    textSpan.appendChild(text);

    parentNode.appendChild(wrapper);
    wrapper.appendChild(a);
    a.appendChild(arrowStyled);
    a.appendChild(textSpan);
  }
}
