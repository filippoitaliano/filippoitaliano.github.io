class PreviewImage {
  static TYPE = {
    normal: 'normal',
    promoted: 'promoted',
  };

  constructor(url, type) {
    this.type = type || PreviewImage.TYPE.small;
    this.src = url;
  }

  wrapperClassByType() {
    if (this.type === PreviewImage.TYPE.small) {
      return 'small-preview-image-wrapper';
    }
    return 'preview-image-wrapper';
  }

  appendTo(parentNode) {
    const previewImageWrapper = createNode(`preview-image-wrapper ${this.wrapperClassByType()}`)
    const previewImageImg = createNode('preview-image-img', 'img');
    previewImageImg.src = this.src;

    parentNode.appendChild(previewImageWrapper);
    previewImageWrapper.appendChild(previewImageImg);
  }
}
