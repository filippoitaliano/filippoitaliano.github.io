class Component {

  _id;
  _props;
  _parentNode;

  appendTo(parentNode) {
    throw new Error('Component.appendTo is an abstract method that you have to implement');
  }

  update(props) {
    this._parentNode.querySelector(`#${this._id}`).remove();
    this._props = { ...this._props, ...props };
    this.appendTo(this._parentNode);
  }

}
