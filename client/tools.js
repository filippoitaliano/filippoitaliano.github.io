const createNode = (className, elementType = 'div') => {
  const node = document.createElement(elementType);
  node.setAttribute('class', className);
  return node;
};

const appendInnerHtmlTemplate = (parentNode, templateId, template) => {
  parentNode.insertAdjacentHTML('beforeend', template);
  return parentNode.querySelector(`#${templateId}`);
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

const getRandomNumber = () => (
  Math.floor(Math.random() * 10000000000000000)
);

const withDefaultValues = (obj, defaultObj) => ({
  ...defaultObj,
  ...obj,
});

const get = async (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.timeout = 500;
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