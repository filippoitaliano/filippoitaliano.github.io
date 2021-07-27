class Title {
  constructor(text) {
    this.text = text;
  }

  appendTo(parentNode) {
    const template = `
      <div class="title-wrapper">
        <h1 class="title-body-text"/>
      </div>
    `;
    appendInnerHtmlTemplate(parentNode, template);
    const target = getFirstElementByClassName(parentNode, 'title-body-text');
    target.append(this.text);
  }
}
