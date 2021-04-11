class Article {
  id;
  relevance;
  promoted;
  abstract;
  previewPicture;
  paragraphs;

  constructor(id, relevance, promoted, abstract, previewPicture, paragraphs) {
    this.id = id;
    this.relevance = relevance;
    this.promoted = promoted;
    this.abstract = abstract;
    this.previewPicture = previewPicture;
    this.paragraphs = paragraphs;
  }

  render(parentNode) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute('class', 'preview-image-wrapper');

    const img = document.createElement("img");
    img.src = this.previewPicture;

    parentNode.appendChild(wrapper);
    wrapper.appendChild(img);
  }
}
