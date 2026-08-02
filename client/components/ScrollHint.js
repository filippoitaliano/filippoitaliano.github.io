/**
 * The arrow that says there is more of something off to the right.
 *
 * Anything that scrolls sideways inside its own box gets one: the artifacts bar
 * and the code blocks both cut their content off at the edge with nothing to say
 * so. It breathes in and out slowly rather than sitting there, it only shows up
 * when the box really does scroll, and it goes away for good once you have got
 * to the end — at which point it has nothing left to point at.
 */
class ScrollHint {

  /**
   * @param {Node} wrapper the positioned box the arrow is pinned to, around
   *   the scroller: an arrow inside the scroller would scroll away with the
   *   content it is pointing at
   * @param {Node} scroller the element that actually overflows
   */
  static appendTo(wrapper, scroller) {
    const id = `scrollhint_${getRandomNumber()}`;

    appendInnerHtmlTemplate(wrapper, id, `
      <span class="scroll-hint" id="${id}" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12">
          <g fill="none" stroke="#f71735" stroke-width="1.4" stroke-linecap="round">
            <path d="M2 1.6 L6.2 6"/>
            <path d="M2 10.4 L6.2 6"/>
          </g>
        </svg>
      </span>
    `);

    const hint = wrapper.querySelector(`#${id}`);

    const update = () => {
      const hidden = scroller.scrollWidth - scroller.clientWidth;
      const left = hidden - scroller.scrollLeft;
      // a couple of pixels of slack: sub-pixel layout leaves a sliver of scroll
      // room on boxes that visually have none
      hint.classList.toggle('is-visible', hidden > 2 && left > 2);
    };

    scroller.addEventListener('scroll', update, { passive: true });
    // The bar is as wide as the window, so it stops and starts overflowing as
    // the window is resized.
    if (window.ResizeObserver) {
      new ResizeObserver(update).observe(scroller);
    }
    update();
  }

}
