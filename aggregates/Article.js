class Article {
  id;
  relevance;
  promoted;
  abstract;
  previewPicture;
  paragraphs;

  constructor(id, title, relevance, promoted, abstract, previewPicture, paragraphs) {
    this.id = id;
    this.title = title;
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
    const articleWrapper = createNode('article-wrapper');
    parentNode.appendChild(articleWrapper);

    const prevPic = new PreviewImage(this.previewPicture, this.previewImageType());
    prevPic.appendTo(articleWrapper);

    const abstPar = new Paragraph(this.abstract);
    abstPar.appendTo(articleWrapper);

    const title = new Title(this.title);
    title.appendTo(articleWrapper);

    const bodyWrapper = createNode('body-wrapper');
    this.paragraphs.forEach((paragraph) => {
      const body = new Paragraph(paragraph.body);
      body.appendTo(bodyWrapper);
    });
    articleWrapper.appendChild(bodyWrapper);
  }
}
