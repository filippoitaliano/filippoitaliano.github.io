class ArrowLink {

  constructor(href, text, reverse) {
    this.href = href;
    this.text = text;
    this.reverse = reverse;
  }

  getSvgClassName() {
    if (this.reverse) return 'arrow-link-svg arrow-link-svg-reverse';
    return 'arrow-link-svg';
  }

  appendTo(parentNode) {
    const a = createNode('arrow-link-a', 'a');
    a.href = this.href;
    
    const arrow = createNode(this.getSvgClassName(), 'span');
    arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="31.432" height="9.664" viewBox="234.9 304.668 31.432 9.664"><defs><style>.a{fill:none;stroke:red;stroke-linecap:round;stroke-width:1.2px;}</style></defs><line class="a" x2="30" transform="translate(235.5 309.5)"/><line class="a" x2="6" y2="4" transform="translate(259.5 305.5)"/><line class="a" y1="4" x2="6" transform="translate(259.5 309.5)"/></svg>';
    
    const text = document.createTextNode(this.text);
    const textSpan = createNode('arrow-link-text', 'span');
    textSpan.appendChild(text);

    parentNode.appendChild(a);
    a.appendChild(arrow);
    a.appendChild(textSpan);
  }

}
