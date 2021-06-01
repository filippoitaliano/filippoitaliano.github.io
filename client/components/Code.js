class Code {
  constructor(text, type) {
    this.setSource(text);
    this.type = type;
  }

  setSource(text) {
    this.source = text.split('\n');
  }

  appendTo(parentNode) {
    const codeWrapper = createNode('code-wrapper');
    parentNode.appendChild(codeWrapper);
    
    this.source.forEach((line, index) => {
      const sourceLine = createNode('code-source-line', 'span');
      sourceLine.innerHTML = line;
      codeWrapper.appendChild(sourceLine);
    }); 

    const codeType = createNode('code-type-ribbon');
    codeType.innerHTML = this.type;
    codeWrapper.appendChild(codeType);
  }
}
