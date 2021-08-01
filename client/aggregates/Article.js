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
    const template = appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="${this.articleClassName()} grid-layout-wrapper" id="${this.id}">
        <div class="title-wrapper"></div>
        <div class="article-preview-image-wrapper"></div>
        <div class="abstract-wrapper"></div>
        <div class="body-wrapper"></div>
      <div>
    `);

    const prevPic = new PreviewImage(this.previewPicture, this.previewImageType());
    prevPic.appendTo(template.querySelector('.article-preview-image-wrapper'));

    const abstPar = new Paragraph(this.abstract);
    abstPar.appendTo(template.querySelector('.abstract-wrapper'));

    // TODO: link at the end of the first paragraph if promoted
    const link = new ArrowLink(`#article/${this.id}`, 'leggi tutto');
    link.appendTo(template.querySelector('.abstract-wrapper'));

    if (this.fullContent || this.promoted) {
      const title = new Title({ text: this.title });
      title.appendTo(template.querySelector('.title-wrapper'));

      setTimeout(() => { title.update({ text: 'Giorgio' }) }, 3000)

      if (this.body.length > 0) {
        const bodyWrapper = template.querySelector('.body-wrapper')
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
      }
    }
  }

}
