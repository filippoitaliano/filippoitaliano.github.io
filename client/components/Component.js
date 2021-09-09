const _createPropsUpdater = (defaults = {}, transformations = {}) => (currentProps, changes = {}) => {
  const groundedProps = { ...defaults, ...currentProps, ...changes };
  return Object.keys(groundedProps).reduce((transformed, key) => {
    if (transformations[key] && groundedProps[key]) {
      return { ...transformed, [key]: transformations[key](groundedProps[key]) };
    }
    return { ...transformed, [key]: groundedProps[key] };
  }, {});
}

class Component {

  _id;
  _props;
  _parentNode;

  constructor(props, defaults, transformations) {
    this._updateProps = _createPropsUpdater(defaults, transformations);
    this._props = this._updateProps(props);
  }

  saveParentNode(parentNode) {
    this._parentNode = parentNode;
  }

  update(changes) {
    this._props = this._updateProps(this._props, changes);
    this._parentNode.querySelector(`#${this._id}`).remove();
    this.appendTo(this._parentNode);
  }

}
