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

  articleClassName() {
    if (this.promoted) return 'promoted-article-wrapper';
    return 'article-wrapper';
  }

  appendTo(parentNode) {
    const articleWrapper = createNode(`${this.articleClassName()} grid-layout-wrapper`);
    parentNode.appendChild(articleWrapper);

    const prevPic = new PreviewImage(this.previewPicture, this.previewImageType());
    prevPic.appendTo(articleWrapper);

    const abstractWrapper = createNode('abstract-wrapper');
    articleWrapper.appendChild(abstractWrapper);

    const abstPar = new Paragraph(this.abstract);
    abstPar.appendTo(abstractWrapper);

    const link = new Link(`#article/${this.id}`, 'leggi tutto');
    link.appendTo(abstractWrapper);

    if (this.promoted) {
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
}
