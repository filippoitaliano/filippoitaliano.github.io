class Article {

  constructor(articleData = { id, title, relevance, promoted, abstract, previewPicture, body }, displayAll) {
    this.id = articleData.id;
    this.title = articleData.title;
    this.relevance = articleData.relevance;
    this.promoted = articleData.promoted;
    this.abstract = articleData.abstract;
    this.previewPicture = articleData.previewPicture;
    this.body = articleData.body;
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

    if (this.promoted || this.displayAll) {
      const title = new Title(this.title);
      title.appendTo(articleWrapper);

      if (this.body.length > 0) {
        const bodyWrapper = createNode('body-wrapper');

        if (this.displayAll) {
          this.body.forEach((element) => {
            switch(element.type) {
              case 'p':
                const p = new Paragraph(element.content);
                p.appendTo(bodyWrapper);   
            }
          });
        } else {
          const firstParagrah = this.body.find((element) => element.type === 'p');
          if (firstParagrah) {
            const p = new Paragraph(firstParagrah.content);
            p.appendTo(bodyWrapper);  
          }
        }
        articleWrapper.appendChild(bodyWrapper);
      }
    }
  }

}
