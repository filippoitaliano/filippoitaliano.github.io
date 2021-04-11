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
    const prevPic = new PreviewImage(this.previewPicture);
    prevPic.render(parentNode);

    const abstPar = new Paragraph(this.abstract);
    abstPar.render(parentNode);
  }
}
