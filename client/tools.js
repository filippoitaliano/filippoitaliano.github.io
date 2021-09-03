const createNode = (className, elementType = 'div') => {
  const node = document.createElement(elementType);
  node.setAttribute('class', className);
  return node;
};

const appendInnerHtmlTemplate = (parentNode, template) => {
  parentNode.insertAdjacentHTML('beforeend', template);
};

const getFirstElementByClassName = (parentNode, className) => (
  parentNode.getElementsByClassName(className)[0]
);

const clearNodeContent = (node) => {
  node.innerHTML = null;
};

const getLocationHashEntityType = () => (
  location.hash.split('/')[0]
);

const getLocationHashEntityId = () => (
  location.hash.split('/')[1]
);

const get = async (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.timeout = 5000;
  xhr.open('GET', url);
  xhr.send();
  xhr.onreadystatechange = function() { 
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          callback(JSON.parse(xhr.responseText));
        } catch (error) {
          callback(null);
        }
      } else callback(null);
    }
  }
};