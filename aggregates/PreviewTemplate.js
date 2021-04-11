class PreviewTemplate {
  constructor(text, href, img) {
    this.paragraph = new P
    this.src = url;

  }

  render(parentNode) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute('class', 'preview-image-wrapper');

    const img = document.createElement("img");
    img.src = this.src;

    parentNode.appendChild(wrapper);
    wrapper.appendChild(img);
  }
}
