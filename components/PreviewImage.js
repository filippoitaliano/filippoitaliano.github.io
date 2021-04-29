class PreviewImage {
  static TYPE = {
    normal: 'normal',
    promoted: 'promoted',
  };

  constructor(url, type) {
    this.type = type || PreviewImage.TYPE.normal;
    this.src = url;
  }

  wrapperClassByType() {
    if (this.type === PreviewImage.TYPE.normal) {
      return 'preview-image-normal-wrapper';
    }
    return 'preview-image-promoted-wrapper';
  }

  appendTo(parentNode) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute('class', `preview-image-wrapper ${this.wrapperClassByType()}`);

    const img = document.createElement("img");
    img.src = this.src;

    parentNode.appendChild(wrapper);
    wrapper.appendChild(img);
  }
}
