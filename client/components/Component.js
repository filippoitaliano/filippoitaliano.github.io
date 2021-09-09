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

  props;
  parentNode;
  id;

  constructor(props, defaults, transformations) {
    this._updateProps = _createPropsUpdater(defaults, transformations);
    this.props = this._updateProps(props);
  }

  saveParentNode(parentNode) {
    this.parentNode = parentNode;
  }

  update(changes) {
    this.props = this._updateProps(this.props, changes);
    this.parentNode.querySelector(`#${this.id}`).remove();
    this.appendTo(this.parentNode);
  }

}
