class Component {

  id;
  parentNode;

  appendTo(parentNode) {
    throw new Error('Component.appendTo is an abstract method that you have to implement');
  }

  update(props) {
    this.parentNode.querySelector(`#${this.id}`).remove();
    this.props = { ...this.props, ...props };
    this.appendTo(this.parentNode);
  }

}
