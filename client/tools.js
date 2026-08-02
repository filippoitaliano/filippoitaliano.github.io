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

const handleBookmarkedPath = () => {
  if (location.hash.includes('#bookmark')) {
    const path = location.hash.substr(location.hash.indexOf('#bookmark') + 9);
    history.pushState({ path }, document.title, path);
  }
  location.hash = '';
}

const getLocationAreaPath = () => (
  location.pathname.split('/')[1]
);

const getLocationEntityId = () => (
  location.pathname.split('/')[2]
);

const navigate = (path) => {
  history.pushState({ path }, document.title, path);
  const event = new CustomEvent('pathchange');
  window.dispatchEvent(event);
  return false;
}

const getRandomNumber = () => (
  Math.floor(Math.random() * 10000000000000000)
);

const get = async (url, callback) => {
  const xhr = new XMLHttpRequest();
  // Render's free plan spins the service down when idle: the first request
  // after a pause has to wait for the cold start.
  xhr.timeout = 90000;
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