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
    const target = parentNode.getElementsByClassName('title-body-text')[0];
    target.append(this.text);
  }
}
