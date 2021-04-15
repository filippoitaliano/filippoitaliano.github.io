class Link {
  constructor(href, text) {
    this.href = href;
    this.text = text;
  }

  render(parentNode) {
    const a = document.createElement("a");
    a.href = this.href;
    a.setAttribute('class', 'link-a');
    
    const arrow = document.createElement('span');
    arrow.setAttribute('class', 'link-arrow-span');
    arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="31.432" height="9.664" viewBox="234.9 304.668 31.432 9.664"><defs><style>.a{fill:none;stroke:red;stroke-linecap:round;stroke-width:1.2px;}</style></defs><line class="a" x2="30" transform="translate(235.5 309.5)"/><line class="a" x2="6" y2="4" transform="translate(259.5 305.5)"/><line class="a" y1="4" x2="6" transform="translate(259.5 309.5)"/></svg>';
    
    const text = document.createTextNode(this.text);
    const textSpan = document.createElement('span');
    textSpan.appendChild(text);

    parentNode.appendChild(a);
    a.appendChild(arrow);
    a.appendChild(textSpan);
  }
}
