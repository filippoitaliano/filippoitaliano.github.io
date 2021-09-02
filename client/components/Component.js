const _withTransformations = (props, transformations) => Object.keys(props).reduce((transformed, key) => {
  console.log(props[key]);
  if (!!transformations[key]) return ({ ...transformed, [key]: transformations[key](props[key]) });
  return ({ ...transformed, [key]: props[key] });
});

const _createPropsUpdater = (defaults, transformations) => (currentProps, nextProps = {}) => (
  _withTransformations({ ...(defaults || {}), ...(currentProps || {}), ...(nextProps || {})}, transformations || {})
);

class Component {

  _id;
  _props;
  _parentNode;

  constructor(props, defaults, transformations) {
    console.log('transformations', transformations)
    // TODO: Make transformations work
    this._props = { ...(defaults || {}), ...props };
  }

  appendTo(parentNode) {
    this._parentNode = parentNode;
  }

  update(nextProps) {
    this._props = this._updateProps(this.props, nextProps);
    this._parentNode.querySelector(`#${this._id}`).remove();
    this.appendTo(this._parentNode);
  }

}
