const createNode = (className, elementType = 'div') => {
  const node = document.createElement(elementType);
  node.setAttribute('class', className);
  return node;
}

const getLocationHashEntityType = () => {
  return location.hash.split('/')[0];
}

const getLocationHashEntityId = (locationHash) => {
  return location.hash.split('/')[1];
}