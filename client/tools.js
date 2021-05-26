const createNode = (className, elementType = 'div') => {
  const node = document.createElement(elementType);
  node.setAttribute('class', className);
  return node;
};

const clearNodeContent = (node) => {
  node.innerHTML = null;
};

const getLocationHashEntityType = () => {
  return location.hash.split('/')[0];
};

const getLocationHashEntityId = () => {
  return location.hash.split('/')[1];
};

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