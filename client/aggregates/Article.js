class Article {

  constructor(articleData = { id, title, relevance, promoted, abstract, previewPicture, body }, fullContent) {
    this.id = articleData.id;
    this.title = articleData.title;
    this.relevance = articleData.relevance;
    this.promoted = articleData.promoted;
    this.abstract = articleData.abstract;
    this.previewPicture = articleData.previewPicture;
    this.body = articleData.body;
    this.fullContent = fullContent;
  }

  previewImageType() {
    if (this.fullContent || this.promoted) return PreviewImage.TYPE.normal;
    return PreviewImage.TYPE.small;
  }

  articleClassName() {
    if (this.fullContent || this.promoted) return 'six-columns-grid-container article-wrapper';
    return 'six-columns-grid-container article-preview-wrapper';
  }

  appendTo(parentNode) {
    const articleWrapper = createNode(`${this.articleClassName()} grid-layout-wrapper`);
    parentNode.appendChild(articleWrapper);

    const previewImageWrapper = createNode('article-preview-image-wrapper');
    articleWrapper.appendChild(previewImageWrapper);
    const prevPic = new PreviewImage(this.previewPicture, this.previewImageType());
    prevPic.appendTo(previewImageWrapper);

    const abstractWrapper = createNode('abstract-wrapper');
    articleWrapper.appendChild(abstractWrapper);

    const abstPar = new Paragraph(this.abstract);
    abstPar.appendTo(abstractWrapper);

    // TODO: link at the end of the first paragraph if promoted
    const link = new ArrowLink(`#article/${this.id}`, 'leggi tutto');
    link.appendTo(abstractWrapper);

    if (this.fullContent || this.promoted) {
      const title = new Title(this.title);
      title.appendTo(articleWrapper);

      if (this.body.length > 0) {
        const bodyWrapper = createNode('body-wrapper');

        if (this.fullContent) {
          this.body.forEach((element) => {
            switch(element.type) {
              case 'p':
                const p = new Paragraph(element.content);
                p.appendTo(bodyWrapper);
                break;
              case 'code': 
                const c = new Code(element.content, element.codeType);
                c.appendTo(bodyWrapper);
            }
          });
        } else {
          const firstParagrah = this.body.find((element) => element.type === 'p');
          if (firstParagrah) {
            const p = new Paragraph(firstParagrah.content);
            p.appendTo(bodyWrapper);  
          }
          const separator = createNode('article-promoted-separator');
          bodyWrapper.appendChild(separator);
        }
        articleWrapper.appendChild(bodyWrapper);
      }
    }
  }

}
