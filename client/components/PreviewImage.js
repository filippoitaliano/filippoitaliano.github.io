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
    this.id = `previewimage_${getRandomNumber()}`;
  }

  wrapperClassByType() {
    if (this.props.type === PREVIEW_IMAGE_TYPE.small) {
      return 'small-preview-image-wrapper';
    }
    return 'preview-image-wrapper';
  }

  appendTo(parentNode) {
    super.saveParentNode(parentNode);

    appendInnerHtmlTemplate(parentNode, this.id, `
      <div class="preview-image-wrapper ${this.wrapperClassByType()}" id="${this.id}">
        <img class="preview-image-img" src="${this.props.src}"/>
      </div>
    `);
  }
  
}
