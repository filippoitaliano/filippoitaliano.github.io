const createNode = (className, elementType = 'div') => {
  const node = document.createElement(elementType);
  node.setAttribute('class', className);
  return node;
}