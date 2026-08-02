/**
 * The one arrow on the site. Every place that draws one draws this one, so it
 * only has to be redrawn — and its hover only has to be retuned — in one place.
 *
 * The `arrow-icon` class carries the behaviour: `.arrow-icon` leans forward
 * under any link it sits in, wherever that link is, without the link having to
 * know it is holding an arrow.
 *
 * @param {Object} options
 * @param {boolean} options.reverse point it back the way it came
 * @param {string} options.className anything the caller needs on the same span,
 *   spacing usually
 */
const arrowIcon = ({ reverse = false, className = '' } = {}) => `
  <span class="arrow-icon${reverse ? ' arrow-icon-reverse' : ''}${className ? ` ${className}` : ''}">
    <svg xmlns="http://www.w3.org/2000/svg" width="31.432" height="9.664" viewBox="234.9 304.668 31.432 9.664" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#f71735" stroke-linecap="round" stroke-width="1.2">
        <line x2="30" transform="translate(235.5 309.5)"/>
        <line x2="6" y2="4" transform="translate(259.5 305.5)"/>
        <line y1="4" x2="6" transform="translate(259.5 309.5)"/>
      </g>
    </svg>
  </span>
`;

/**
 * The chevron the scroll hint points with: the same arrow seen end on, so a box
 * that can be scrolled says so in the same hand as everything else.
 */
const chevronIcon = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" aria-hidden="true" focusable="false">
    <g fill="none" stroke="#f71735" stroke-width="1.6" stroke-linecap="round">
      <path d="M2.6 2.2 L8.4 8"/>
      <path d="M2.6 13.8 L8.4 8"/>
    </g>
  </svg>
`;
