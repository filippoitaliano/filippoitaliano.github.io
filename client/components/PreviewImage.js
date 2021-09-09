/**
 * @enum {PreviewImageType}
 */
const PREVIEW_IMAGE_TYPE = {
  normal: 'normal',
  promoted: 'promoted',
};

class PreviewImage extends Component {

  /**
   * @param {Object} props
   * @param {string} props.src
   * @param {PreviewImageType} props.type
   */
  constructor(props) {
    super(props, { type: PREVIEW_IMAGE_TYPE.small });
    this._id = `previewimage_${getRandomNumber()}`;
  }

  wrapperClassByType() {
    if (this._props.type === PREVIEW_IMAGE_TYPE.small) {
      return 'small-preview-image-wrapper';
    }
    return 'preview-image-wrapper';
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    const previewImageWrapper = createNode(`preview-image-wrapper ${this.wrapperClassByType()}`)
    const previewImageImg = createNode('preview-image-img', 'img');
    previewImageImg.src = this._props.src;

    parentNode.appendChild(previewImageWrapper);
    previewImageWrapper.appendChild(previewImageImg);
  }
  
}
