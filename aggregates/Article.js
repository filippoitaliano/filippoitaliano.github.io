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

  previewImageType() {
    if (this.promoted) return PreviewImage.TYPE.promoted;
    return PreviewImage.TYPE.normal;
  }

  appendTo(parentNode) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'article-wrapper');
    
    parentNode.appendChild(wrapper);

    const prevPic = new PreviewImage(this.previewPicture, this.previewImageType());
    prevPic.appendTo(wrapper);

    const abstPar = new Paragraph(this.abstract);
    abstPar.appendTo(wrapper);
  }
}
