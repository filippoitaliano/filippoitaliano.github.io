// How long the box has to sit still before the arrow comes back.
const SCROLL_HINT_IDLE_MS = 600;

/**
 * The arrow that says there is more of something off to the right.
 *
 * Anything that scrolls sideways inside its own box gets one: the artifacts bar
 * and the code blocks both cut their content off at the edge with nothing to say
 * so. It breathes in and out slowly rather than sitting there, and it only ever
 * shows up when it has something to say: not while you are scrolling, because
 * then you already know, and not once you have reached the end, because then
 * there is nothing left to point at.
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
        ${chevronIcon()}
      </span>
    `);

    const hint = wrapper.querySelector(`#${id}`);
    let idle = null;

    const moreToTheRight = () => {
      const hidden = scroller.scrollWidth - scroller.clientWidth;
      // a couple of pixels of slack: sub-pixel layout leaves a sliver of scroll
      // room on boxes that visually have none
      return hidden > 2 && hidden - scroller.scrollLeft > 2;
    };

    const settle = () => hint.classList.toggle('is-visible', moreToTheRight());

    // The arrow is there to say the box can be scrolled, so the moment you are
    // scrolling it has made its point — and the fade it sits on is over the
    // content you are moving past. It steps aside and comes back once the box
    // has been still for a moment, if there is still something over there.
    const onScroll = () => {
      hint.classList.remove('is-visible');
      clearTimeout(idle);
      idle = setTimeout(settle, SCROLL_HINT_IDLE_MS);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    // The bar is as wide as the window, so it stops and starts overflowing as
    // the window is resized.
    if (window.ResizeObserver) {
      new ResizeObserver(settle).observe(scroller);
    }
    settle();
  }

}
