class Article {

  constructor(articleData = { id, title, relevance, promoted, abstract, previewPicture, paragraphs }, displayAll) {
    this.id = articleData.id;
    this.title = articleData.title;
    this.relevance = articleData.relevance;
    this.promoted = articleData.promoted;
    this.abstract = articleData.abstract;
    this.previewPicture = articleData.previewPicture;
    this.paragraphs = articleData.paragraphs;
    this.displayAll = displayAll;
  }

  previewImageType() {
    if (this.promoted) return PreviewImage.TYPE.promoted;
    return PreviewImage.TYPE.normal;
  }

  articleClassName() {
    // TODO: bad className or two different cases
    if (this.promoted || this.displayAll) return 'promoted-article-wrapper';
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

    // TODO: link at the end of the first paragraph if promoted
    const link = new Link(`#article/${this.id}`, 'leggi tutto');
    link.appendTo(abstractWrapper);

    // TODO: show only first paragraph without media if promoted
    if (this.promoted || this.displayAll) {
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
